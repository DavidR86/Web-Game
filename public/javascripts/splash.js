	
function(){


	const socket = new WebSocket("ws://localhost:3000");
	socket.onopen =  function(event){

		let msg = messages.STATISTICS_REQUEST;
		socket.send(JSON.stringify(msg));
		console.log("hi this works");
	}

	

	socket.onmessage = function(){
		let msg = JSON.parse(event.data);
		if(msg.kind===messages.kind.STATISTICS_REQUEST){
			let stats = JSON.parse(msg.data);
			let totalTime = stats.time;
			let openRooms = stats.openRooms;
			let currentGames = stats.gamesNumber;
			console.log(totalTime);
			console.log(openRooms);
			console.log(currentGames)
			//statUpdate();
		}
	}
}	
