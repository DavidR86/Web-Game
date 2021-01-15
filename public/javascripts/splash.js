	

(function(){


	const socket = new WebSocket((window.location.host === "astraria.org") ? "wss://astraria.org" : "ws://localhost:3000");
    socket.onopen = function(event){
	let msg = messages.STATISTICS_REQUEST;
		socket.send(JSON.stringify(msg));

	}

	

	socket.onmessage = function(event){
		let msg = JSON.parse(event.data);
	    if(msg.kind===messages.kind.STATISTICS_REQUEST){
		console.log(msg)
		document.getElementById("totalTime").textContent = "The total time played is: " + msg.data.time;
		document.getElementById("openRooms").textContent = "The amount of open rooms at this moment is: "+msg.data.openRooms;
		document.getElementById("numPlayers").textContent = "The amount of players is: "+msg.data.playerNumber;
	    }

	}
})();
