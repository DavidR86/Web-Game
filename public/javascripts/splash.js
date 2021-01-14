	

(function(){


	const socket = new WebSocket("ws://localhost:3000");
	socket.onopen = function(event){
		htmlString.textContent = "lets see if this works"
		console.log("hi this works");
		let msg = messages.STATISTICS_REQUEST;
		socket.send(JSON.stringify(msg));

	}

	

	socket.onmessage = function(event){
		let msg = JSON.parse(event.data);
	    if(msg.kind===messages.kind.STATISTICS_REQUEST){
			console.log(msg)
			totalTime.textContent = "The total time played is: " + msg.time;
			openRooms.textContent = "The amount of open rooms at this moment is: "+msg.openRooms;
			currentGames.textContent = "The amount of games currently played is: "+msg.gamesNumber;

		}

	}
})();
