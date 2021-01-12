	
(funciont(){
	const socket = new WebSocket("ws://localhost:3000");
	socket.onmessage =  function(event){
		let msg = JSON.parse(event.data);

		if(msg.kind===messages.kind.STATISTICS_REQUEST){
			
		}

	}



	function statUpdate(){
		fastestGame.textContent = fastestTime;
		totalTimeSpent.textContent = sumAllTimes;
		totalGamesPlayed.textContent = startedGames;
	}

	function statAdded(){
		var sumAllTimes = 0;
		var playedGames = 0;
		var fastestGame;

		/from board.js/
		var GAME_STARTED;
		var GAME_WON;
		

		if(GAME_WON){
			playedGames++;
			sumAllTimes += gameStopTime;
			if(gameStopTime<fastestTime){
				fastestTime = gameStopTime;
				
			}
			

		}
	}
}	
)