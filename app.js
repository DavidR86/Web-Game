
var express = require("express");
var http = require("http");
const websocket = require("ws");

// Messages server will use
var messages = require("./public/javascripts/messages");

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));
const server = http.createServer(app);

// Route for game (for development only)
app.get('/game', function (req, res) {
    res.sendFile("game.html", {root: "./public"});
})

// Route for splash screen
app.get('/', function (req, res) {
    res.sendFile("splash.html", {root: "./public"});
})

const wss = new websocket.Server({ server });

var GameLogic = require("./game");

let gamesMap = new Map();
// gamesMap.set(0 , {gameBoard:null conn:[null, null], available: true, players: 0});

// var game = new GameLogic();

var Stockfish = require("stockfish");


var findGame = function(ws){
    var found = false;

    var next = gamesMap.entries().next();
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
var st_queue = [];

wss.on("connection", function (ws) {
    var found = findGame(ws);
    // console.log(found);
    var player = found.player;
    var gameKey = found.key;

    if(player===1){
	let msg = messages.GAME_START;
	msg.player = messages.player.BLACK;
	ws.send(JSON.stringify(msg));

	msg.player = messages.player.WHITE;
	gamesMap.get(gameKey).conn[1-player].send(JSON.stringify(msg));
	gamesMap.get(gameKey).started=true;
    }

    var stockfish = new Stockfish();
    stockfish.onmessage = function(event){
	console.log(event);
	if(event.includes("bestmove ")){
	    var answer = messages.POSITION_RESPONSE;
	    var data = st_queue.pop();
	    var ws = data.ws;
	    var game = data.game;
	    var move = game.bestmoveToCoord(event);
	    answer.data = game.bestmoveToCoord(event);
	    answer.data.string = event;
	    ws.send(JSON.stringify(answer));
	}
    }

    ws.on("message", function incoming(message) {
	let msg = JSON.parse(message);

	switch(msg.kind) {
	    case messages.kind.GET_AV_MOVES:
		var game = gamesMap.get(gameKey).gameBoard;
		var answer = messages.AVAILABLE_MOVES;
		answer.data = game.getAvailableMoves(msg.fromX, msg.fromY);
		ws.send(JSON.stringify(answer));
		
		break;
	    case messages.kind.CHECK_MOVE:
		var game = gamesMap.get(gameKey).gameBoard;
		var move = game.checkMove(msg.fromX, msg.toX, msg.fromY, msg.toY);
		console.log(move);

		if(!(move===null)){
		    var answer = messages.PLAYER_MOVE;
		    answer.player = move.player;
		    answer.fromX = move.fromX;
		    answer.fromY = move.fromY;
		    answer.toX = move.toX;
		    answer.toY = move.toY;
		    answer.piece = move.piece;
		    answer.piece_color = move.piece_color;
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
		console.log(game.checkGameOver())
		if(checkGameOver.game_over){
		    var answer = messages.GAME_WON;
		    answer.player = checkGameOver.winner;
		    ws.send(JSON.stringify(answer));
		    gamesMap.get(gameKey).conn[1-player].send(JSON.stringify(answer));
		}
		
		break;
	    case messages.kind.POSITION_REQUEST:
		console.log(msg)
		var game = gamesMap.get(gameKey).gameBoard;
		st_queue.push({ws: ws, game: game});
		stockfish.postMessage("position fen "+game.getFen());
		stockfish.postMessage("go infinite")
		setTimeout(function(){
		    stockfish.postMessage("stop");
		    
		}, 1000);
		
		break;
	    default:
		console.log(msg);
		
	}
    });

    ws.on('close', function closed(event) {
	console.log(event);

	if(!gamesMap.has(gameKey)){return; }; // Game already deleted
	
	// Notify other player if game started
	if(gamesMap.get(gameKey).started){
	    let msg = messages.GAME_DISCONNECTED;
	    console.log(msg);
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
