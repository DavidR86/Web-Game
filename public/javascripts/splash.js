	

(function(){


	const socket = new WebSocket("ws://localhost:3000");
	socket.onopen =  function(event){

		let msg = messages.STATISTICS_REQUEST;
		socket.send(JSON.stringify(msg));
		console.log("hi this works");
	}

	

	socket.onmessage = function(event){
		let msg = JSON.parse(event.data);
	    if(msg.kind===messages.kind.STATISTICS_REQUEST){
		console.log(msg)
			let totalTime = msg.time;
			let openRooms = msg.openRooms;
			let currentGames = msg.gamesNumber;
		}
	}
})();
