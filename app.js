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
	
	gamesMap.set(key, {gameBoard: new GameLogic(), conn: [ws, null], available: true, players:1})
    }
    
    // return game key
    return {key: key, player: player};
    
}

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
		}
		break;
	    default:
		console.log(msg);
		
	}
    });
});
    
server.listen(port);
