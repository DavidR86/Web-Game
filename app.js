
var express = require("express");
var http = require("http");
const websocket = require("ws");

// Messages server will use
var messages = require("./public/javascripts/messages");

var port = process.argv[2];
var sf_enable = (process.argv[3] === "true") ? true : false;
var app = express();

app.use(express.static(__dirname + "/public"));
const server = http.createServer(app);

let gamesMap = new Map();

// Route for game (for development only)
app.get('/game', function (req, res) {
    res.sendFile("game.html", {root: "./public"});
})



app.get('/game/p', function (req, res) {
    var key = Math.random().toString().slice(2);
    // Just in case
    while(gamesMap.has(key)){
	key = Math.random();
	}
    
    res.redirect("/game?room="+key);
})

// Route for splash screen
app.get('/', function (req, res) {
    res.sendFile("splash.html", {root: "./public"});
})

const wss = new websocket.Server({ server });

var GameLogic = require("./game");

// gamesMap.set(0 , {gameBoard:null conn:[null, null], available: true, players: 0});

// var game = new GameLogic();



var findGame = function(ws){
    var found = false;

    //var next = gamesMap.entries().next();
    var player;
    var key;
    gamesMap.forEach((game, gkey) => {
	if(game.available){
	    found = true;
	    game.conn[1] = ws;
	    game.available = false;
	    game.players++;
	    player = 1;
	    key = gkey;
	}
    });

    if(!found){
	// No open game was found
	// Create new game
	player = 0;
	key = Math.random();
	// Just in case
	while(gamesMap.has(key)){
	    key = Math.random();
    }
	
	gamesMap.set(key, {gameBoard: new GameLogic(), conn: [ws, null], available: true, players:1, started: false})
    }
    
    // return game key
    return {key: key, player: player};
    
}

var create_private_room = function(ws, key){
    player = 0;
    gamesMap.set(key, {gameBoard: new GameLogic(), conn: [ws, null], available: false, players:1, started: false})
    
    let msg = messages.REQUEST_GAME;
    //msg.room_key = key.toString().slice(2);
    ws.send(JSON.stringify(msg));
    
    // return game key
    return {key: key, player: player};
}

var join_private_room = function(ws, key){
    if(gamesMap.has(key) && gamesMap.get(key).players===1){
	var game = gamesMap.get(key);
	game.conn[1] = ws;
	game.players++;
	player=1;
	return{key: key, player: player, joined: true};
    }
	ws.close();
	return{joined: false};
    
}

var findOpenGameNumber = function() {
    var number = 0;
    //var next = gamesMap.entries().next();
    gamesMap.forEach((game, gkey) => {
	if(game.available){
	    number++;
	}
    });
    return number;
}

var totalPlayers = 0;
var totalGamesPlayed = 0;

var findInGamePlayerNumber = function(){
    var number = 0;
    gamesMap.forEach((game, gkey) => {
	number+=game.players;
    });
    return number;
}

var stockfish_socket;
if(sf_enable){ stockfish_socket = new websocket("ws://localhost:3141");

stockfish_socket.onmessage = function(event){
    var msg = JSON.parse(event.data);
    console.log(msg);
    var answer = messages.POSITION_RESPONSE;
    var gameKey = msg.gameKey;
    var player = msg.player;
    var ws = gamesMap.get(gameKey).conn[player];
    var game = gamesMap.get(gameKey).gameBoard;
    var move = game.bestmoveToCoord(msg.answer);
    answer.data = move
    answer.data.string = event.answer;
    ws.send(JSON.stringify(answer));
}
}



wss.on("connection", function (ws) {
    totalPlayers++;
    var player;
    var gameKey;
    var found;

    ws.on("message", function incoming(message) {
	let msg = JSON.parse(message);

	
	switch(msg.kind) {
	    case messages.kind.REQUEST_GAME:
		var private_room = msg.private_room;
		var room_key = parseFloat("0."+msg.room_key);

		if(private_room && (!gamesMap.has(room_key))){
		    found = create_private_room(ws, room_key);
		}else if(private_room && gamesMap.has(room_key)){
		    found = join_private_room(ws, room_key);
		    if(!found.joined) break;
		}else{
		    found = findGame(ws);
		}

		// found = findGame(ws);
		// console.log(found);
		player = found.player;
		gameKey = found.key;

		if(player===1){
		    let msg = messages.GAME_START;
		    msg.player = messages.player.BLACK;
		    ws.send(JSON.stringify(msg));
		    
		    msg.player = messages.player.WHITE;
		    gamesMap.get(gameKey).conn[1-player].send(JSON.stringify(msg));
		    gamesMap.get(gameKey).started=true;

		    // Game started. Increase game number counter;
		    totalGamesPlayed++;
		}
		break;
	    case messages.kind.STATISTICS_REQUEST:
		var answer = msg;
		
		msg.data = {playerNumber: totalPlayers, openRooms: findOpenGameNumber(), gamesPlayed: totalGamesPlayed}
		ws.send(JSON.stringify(answer));
		break;
	    case messages.kind.GET_AV_MOVES:
		var game = gamesMap.get(gameKey).gameBoard;
		var answer = messages.AVAILABLE_MOVES;
		answer.data = game.getAvailableMoves(msg.fromX, msg.fromY);
		ws.send(JSON.stringify(answer));
		
		break;
	    case messages.kind.CHECK_MOVE:
		var game = gamesMap.get(gameKey).gameBoard;
		var move = game.checkMove(msg.fromX, msg.toX, msg.fromY, msg.toY);

		if(!(move===null)){
		    var answer = messages.PLAYER_MOVE;
		    answer.player = move.player;
		    answer.fromX = move.fromX;
		    answer.fromY = move.fromY;
		    answer.toX = move.toX;
		    answer.toY = move.toY;
		    answer.piece = move.piece;
		    answer.piece_color = move.piece_color;
		    answer.san = move.san;
		    ws.send(JSON.stringify(answer));
		    gamesMap.get(gameKey).conn[1-player].send(JSON.stringify(answer));

		    // Extra moves like castling, promotions & en passant. Only caslting working for now.
		    if(move.additionalMove){
			answer.fromX = move.additionalCoord.from.x;
			answer.fromY = move.additionalCoord.from.y;
			answer.toX = move.additionalCoord.to.x;
			answer.toY = move.additionalCoord.to.y;
			answer.piece = move.additionalPiece;
			ws.send(JSON.stringify(answer));
			gamesMap.get(gameKey).conn[1-player].send(JSON.stringify(answer));
		    }

		}

		// Check for game over
		var checkGameOver = game.checkGameOver();
		if(checkGameOver.game_over){
		    var answer = messages.GAME_WON;
		    answer.player = checkGameOver.winner;
		    ws.send(JSON.stringify(answer));
		    gamesMap.get(gameKey).conn[1-player].send(JSON.stringify(answer));
		}
		
		break;
	    case messages.kind.POSITION_REQUEST:
		if(sf_enable){
		    var game = gamesMap.get(gameKey).gameBoard;
		    
		    var data = {gameKey: gameKey, player: player, fen: game.getFen(), answer: null};
		    stockfish_socket.send(JSON.stringify(data));
		}
		break;
	    default:
		
	}
    });

    ws.on('close', function closed(event) {
	totalPlayers--;
	if(!gamesMap.has(gameKey)){return; }; // Game already deleted
	
	// Notify other player if game started
	if(gamesMap.get(gameKey).started){
	    let msg = messages.GAME_DISCONNECTED;
	    gamesMap.get(gameKey).conn[1-player].send(JSON.stringify(msg));
	}
	// Free resources.
	if(gamesMap.get(gameKey).players==2){
	    gamesMap.get(gameKey).conn[1-player].close();
	}
	gamesMap.delete(gameKey);
    });
});
    
server.listen(port);
