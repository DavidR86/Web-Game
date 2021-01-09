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

wss.on("connection", function (ws) {

    ws.on("message", function incoming(message) {
	console.log("[LOG] " + message);

	let msg = JSON.parse(message);

	switch(msg.kind) {
	    case messages.kind.GET_AV_MOVES:
		var answer = messages.AVAILABLE_MOVES;
		answer.data = [{x: msg.fromX, y: msg.fromY-1}]
		ws.send(JSON.stringify(answer));
		
		break;
	    case messages.kind.CHECK_MOVE:
		// For now, we validate the move directly
		var answer = messages.PLAYER_MOVE;
		answer.player = messages.player.WHITE;
		answer.fromX = msg.fromX;
		answer.fromY = msg.fromY;
		answer.toX = msg.toX;
		answer.toY = msg.toY;
		answer.piece = "pawn";
		ws.send(JSON.stringify(answer));
		
		break;
	    default:
		console.log(msg);
		
	} 
    });
    
    console.log("Connection state: " + ws.readyState);
    
    let msg = messages.GAME_START;
    msg.player = messages.player.WHITE;
    
    ws.send(JSON.stringify(msg));
});

server.listen(port);
