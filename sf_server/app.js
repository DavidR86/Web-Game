    var express = require("express");
    var http = require("http");
    const websocket = require("ws");

    var port = "3141";
    var app = express();

    const server = http.createServer(app);
    const wss = new websocket.Server({ server });
    var Stockfish = require("stockfish");
    stockfish = new Stockfish();

    // {gameKey: gkey, player: player, fen: fen}
    // {gameKey: gkey, player: player, answer: event}
    var queue = [];
    var available = true;

wss.on("connection", function (ws) {

    console.log("server connected!")

    ws.on("message", function incoming(message) {
	var msg = JSON.parse(message);
	    queue.push({gameKey: msg.gameKey, player: msg.player, fen: msg.fen, answer: null});
	    console.log(queue)
	    console.log(message)
	    if(available){
		available = false;
		stockfish.postMessage("position fen "+msg.fen);
		stockfish.postMessage("go infinite")
		setTimeout(function(){
		    stockfish.postMessage("stop");
		    
		}, 3000);
	    }
	});
	
	stockfish.onmessage = function(event){
	    console.log(event);
	    if(event.includes("bestmove ")){

		var message = queue.pop();
		console.log(message)
		message.answer = event;
		ws.send(JSON.stringify(message));

		if(queue.length === 0){
		    available = true;
		}else{
		    stockfish.postMessage("position fen "+queue[queue.length-1].fen);
		    stockfish.postMessage("go infinite")
		    setTimeout(function(){
			stockfish.postMessage("stop");
			
		    }, 3000);
		}
	    }
	}

    });

    

    server.listen(port);
