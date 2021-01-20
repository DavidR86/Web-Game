var GameFunctions = (function () {
    var outer_data = {enableHelp: null, getPos: null, rotate_board: null}

    var col_num = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    
    // Create logical board
    function Cells(cells) {
	this.cells = cells;
	this.selected = null;
	this.hasSelected = false;
    }
    // TODO: Add helper methods to manipulate logical board.
    Cells.prototype.get = function(x, y){
	return this.cells[y][x];
    }

    Cells.prototype.removePiece = function(x, y){
	var parent = this.get(x, y);
	while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
	}
    }

    Cells.prototype.addPiece = function(x, y, kind, color){
	var piece = document.createElement("img");
	var added = (color === "white") ? "_w" : "_b";
	piece.className = (color === "white") ? "piece_white" : "piece_black";
	piece.alt = kind+""+added;
	piece.kind = kind;
	piece.color = color;
	switch(kind) {
	    case "pawn": piece.src = "images/pawn"+added+".svg"
		break;
	    case "rook": piece.src = "images/rook"+added+".svg"
		break;
	    case "bishop": piece.src = "images/bishop"+added+".svg"
		break;
	    case "knight": piece.src = "images/knight"+added+".svg"
		break;
	    case "queen": piece.src = "images/queen"+added+".svg"
		break;
	    case "king": piece.src = "images/king"+added+".svg"
		break;
	    default:
	}
	var prevChild = this.get(x, y).firstChild

	if(prevChild === null){
	    this.get(x, y).appendChild(piece);
	}else{
	    this.get(x,y).replaceChild(piece, prevChild);
	}
	
    }

    
    
    Cells.prototype.highlight = function(x, y){
	if(!this.get(x,y).className.includes(" highlight")){
	    this.get(x,y).className+=" highlight";
	}
    }

    Cells.prototype.removeHighlight = function(x, y){
	this.get(x, y).className = this.get(x, y).className.replace(" highlight", "");
	
    }

    Cells.prototype.removeFocus = function(x, y){
	this.get(x, y).className = this.get(x, y).className.replace(" last_move", "");
	this.get(x, y).className = this.get(x, y).className.replace(" position", "");
    }

    Cells.prototype.removeAllHighlight = function(){
	this.cells.forEach(cellX => {
	    cellX.forEach(cell => {
		this.removeHighlight(cell.x, cell.y);
	    });
	});
    }

    Cells.prototype.highlightCells = function(cells){
	cells.forEach(cell => {
	    this.highlight(cell.x, cell.y);
	});
    }

    Cells.prototype.focusCells = function(x, y, x2, y2, color) {
	// Only 2 at the time
	this.cells.forEach(cellX => {
	    cellX.forEach(cell => {
		this.removeFocus(cell.x, cell.y);
	    });
	});
	this.get(x, y).className+=(color === "yellow") ? " last_move" : " position";
	this.get(x2, y2).className+=(color === "yellow") ? " last_move": " position";

    }
    
    // Get physical boards from html file
    var boardContainer = document.getElementById('board');
    // boardContainer.className = "container";
    let cellsArr = new Array(8);
    var border = document.createElement("div");
    border.className = "board_border";
    boardContainer.insertAdjacentElement("beforeend", border);
    for(var i = 0;  i<8; i++){
	var border = document.createElement("div");
	border.innerText = col_num[i];
	border.className = "board_border";
	boardContainer.insertAdjacentElement("beforeend", border);
    }
    var border = document.createElement("div");
    border.className = "board_border";
    boardContainer.insertAdjacentElement("beforeend", border);
    
    // Create physical tiles in board
    for(var i = 0; i < 8; i++) {
	cellsArr[i] = new Array(8);
	var border = document.createElement("div");
	border.innerText = (8-i);
	border.className = "board_border";
	boardContainer.insertAdjacentElement("beforeend", border);

	for(var j = 0; j < 8; j++) {
	    var cell = document.createElement("div");
	    cell.id = (i+1).toString()+"-"+(j+1).toString();

	    cell.x=j;
	    cell.y=i;
	    cellsArr[i][j] = cell; // add cell to array
	    
	    if((i+j) % 2 == 0) {
		cell.className = "white";
		} else {
		    cell.className = "black";
		}
	    boardContainer.insertAdjacentElement("beforeend", cell);
	    cell.addEventListener("click", function cellClick(e) {
		let cell = event.currentTarget;
		cells.removeAllHighlight();
		//cells.addPiece(e.currentTarget.x, e.currentTarget.y, "rook", "white");
		//cells.highlight(cell.x, cell.y);
		if(cells.hasSelected && (turn === player && !(cells.firstChild === player))){
		 
		    // Attempt to move to this position

		    let msg = messages.CHECK_MOVE;
		    msg.fromX = cells.selected.x;
		    msg.fromY = cells.selected.y;
		    msg.toX = cell.x;
		    msg.toY = cell.y;
		    socket.send(JSON.stringify(msg));
		    cells.hasSelected = false;

		}else if(cell.firstChild!=null && (cell.firstChild.color ===  player && player === turn)){
		    // Ask for av moves
		    let msg = messages.GET_AV_MOVES;
		    msg.fromX = cell.x;
		    msg.fromY = cell.y;
		    socket.send(JSON.stringify(msg));

		    cells.selected = cell;
		    cells.hasSelected = true;
		    
		}else{
		    cells.hasSelected = false;
		}

	    });
	}
	var border = document.createElement("div");
	border.innerText = (8-i);
	border.className = "board_border";
	boardContainer.insertAdjacentElement("beforeend", border);
    }
    var border = document.createElement("div");
    border.className = "board_border";
    boardContainer.insertAdjacentElement("beforeend", border);
    for(var i = 0;  i<8; i++){
	var border = document.createElement("div");
	border.innerText = col_num[i];
	border.className = "board_border";
	boardContainer.insertAdjacentElement("beforeend", border);
    }
    var border = document.createElement("div");
    border.className = "board_border";
    boardContainer.insertAdjacentElement("beforeend", border);

    var cells = new Cells(cellsArr);
    // Put pieces
    cells.addPiece(0, 7, "rook", "white");
    cells.addPiece(1, 7, "knight", "white");
    cells.addPiece(2, 7, "bishop", "white");
    cells.addPiece(3, 7, "queen", "white");
    cells.addPiece(4, 7, "king", "white");
    cells.addPiece(5, 7, "bishop", "white");
    cells.addPiece(6, 7, "knight", "white");
    cells.addPiece(7, 7, "rook", "white");

    cells.addPiece(0, 6, "pawn", "white");
    cells.addPiece(1, 6, "pawn", "white");
    cells.addPiece(2, 6, "pawn", "white");
    cells.addPiece(3, 6, "pawn", "white");
    cells.addPiece(4, 6, "pawn", "white");
    cells.addPiece(5, 6, "pawn", "white");
    cells.addPiece(6, 6, "pawn", "white");
    cells.addPiece(7, 6, "pawn", "white");

    cells.addPiece(0, 0, "rook", "black");
    cells.addPiece(1, 0, "knight", "black");
    cells.addPiece(2, 0, "bishop", "black");
    cells.addPiece(3, 0, "queen", "black");
    cells.addPiece(4, 0, "king", "black");
    cells.addPiece(5, 0, "bishop", "black");
    cells.addPiece(6, 0, "knight", "black");
    cells.addPiece(7, 0, "rook", "black");

    cells.addPiece(0, 1, "pawn", "black");
    cells.addPiece(1, 1, "pawn", "black");
    cells.addPiece(2, 1, "pawn", "black");
    cells.addPiece(3, 1, "pawn", "black");
    cells.addPiece(4, 1, "pawn", "black");
    cells.addPiece(5, 1, "pawn", "black");
    cells.addPiece(6, 1, "pawn", "black");
    cells.addPiece(7, 1, "pawn", "black");

    var old = null;
    var clock = null;

    var start_clock = function(){
	const clock = document.querySelector(".clock");
	let time = new Date(Date.now() - old);
        let sec = time.getSeconds();
        let min = time.getMinutes();
        let hr = time.getHours()-1;
	
        if(sec < 10){
            sec = '0' + sec;
        }
        if(min < 10){
            min = '0' + min;
        }
        if(hr < 10){
            hr = '0' + hr;
        }
        clock.textContent = hr + ':' + min + ':' + sec;
    }
    var turnNumber = 1;
    var recordMove = function(move, color){
	if(color==="white"){
	    var box = document.createElement("div");
	    box.className+="move_box";
	    box.innerText = turnNumber+". "+move;
	    var move_container = document.getElementById("move_container");
	    move_container.appendChild(box);
	    turnNumber++;
	    move_container.scrollTop = move_container.scrollTopMax; // Scroll to bottom
	}else{
	    document.getElementById("move_container").lastChild.innerText+=" "+move;	
	}
	return;
    }

    
    var rotate_white = true;
    var rotate_board = function(){
	document.querySelector(':root').style.setProperty("--rot", (rotate_white) ? "rotate(180deg)" : "rotate(0deg)");
	document.querySelector("#board_container").style.boxShadow = "0px 0px black" 
	setTimeout(function(){
	    document.querySelector("#board_container").style.boxShadow = "var(--shadow)" 
	}, 3000);
	rotate_white = !rotate_white;
    }

    var GAME_STARTED = false;
    var player;
    var turn = "white";

    
    const socket = new WebSocket((window.location.host === "astraria.org") ? "wss://astraria.org" : "ws://localhost:3000");
    socket.onmessage = function(event){
	let msg = JSON.parse(event.data);

	switch(msg.kind) {
	    case messages.kind.GAME_START:
		old = Date.now();
		clock = setInterval(start_clock, 1000);
		GAME_STARTED = true;
		player = msg.player;
		window.alert("Game started: you are "+msg.player);
		document.title = "Centaur: "+msg.player;

		// Draw board & pieces here
		if(player === "black"){
		    // rotate pieces
		    rotate_board();
		    
		}
		document.getElementById("turn").innerText = "white";
		break;
	    case messages.kind.GAME_DISCONNECTED:
		window.alert("Game disconnected");
		console.log(msg);
		clearInterval(clock);
		break;
	    case messages.kind.GAME_WON:
		window.alert("Game won by: "+msg.player);
		clearInterval(clock);
		break;
	    case messages.kind.PLAYER_MOVE:
		cells.removePiece(msg.fromX, msg.fromY);
		cells.addPiece(msg.toX, msg.toY, msg.piece, msg.piece_color);
		turn = msg.player;
		if(turn === player){ document.title+=" 🔔"; }else{document.title = document.title.replace(" 🔔", "");} // Tab bell icon
		cells.hasSelected = false;

		//Highlight last piece
		cells.focusCells(msg.fromX, msg.fromY, msg.toX, msg.toY, "yellow");
		document.getElementById("moveSound").play();
		document.getElementById("turn").innerText = turn;

		recordMove(msg.san, msg.piece_color);
		break;
	    case messages.kind.AVAILABLE_MOVES:
		cells.highlightCells(msg.data);
		//console.log(msg.data);
		break;
	    case messages.kind.POSITION_RESPONSE:
		cells.focusCells(msg.data.from.x, msg.data.from.y, msg.data.to.x, msg.data.to.y, "red");
		console.log(msg.data.string);
		break;
	    case messages.kind.REQUEST_GAME:
	//	var room_key = msg.room_key;
	//	console.log(msg);
	//	window.location.search = "?room="+room_key
		window.alert("Use the link to invite another player!");
		break;
	    default:
		console.log(msg);
		
	} 
    };

    var getPos = function(){
	var msg = messages.POSITION_REQUEST;
	socket.send(JSON.stringify(msg));
    }


    outer_data.enableHelp  = function(){
	document.getElementById("bestMoveButton").disabled=false;
    };

    outer_data.getPos = getPos;
    outer_data.rotate_board = rotate_board;

    socket.onopen = function(){
	let msg = messages.REQUEST_GAME;
	const params = new URLSearchParams(window.location.search);
	if(params.has("room")){
	    msg.private_room = true;
	    msg.room_key = params.get("room");
	}
        socket.send(JSON.stringify(msg));
    };
    return outer_data;
})();
