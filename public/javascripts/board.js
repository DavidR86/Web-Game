(function () {

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
	var added = (color == "white") ? "_w" : "_b";
	piece.className = (color == "white") ? "piece_white" : "piece_black";
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
	this.get(x,y).className+=" highlight";
    }

    Cells.prototype.removeHighlight = function(x, y){
	this.get(x, y).className = this.get(x, y).className.replace("highlight", "");
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
	    console.log(cell)
	    this.highlight(cell.x, cell.y);
	});
    }
    
    // Get physical boards from html file
    var boardContainer = document.getElementById('board_container');
    boardContainer.className = "container";
    let cellsArr = new Array(8);
    
    // Create physical tiles in board
    for(var i = 0; i < 8; i++) {
	cellsArr[i] = new Array(8);
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
		console.log(cell);
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

		}else if(cell.firstChild!=null && (cell.firstChild.color ===  player && player === turn)){
		    console.log(cell.firstChild);

		    // Ask for av moves
		    let msg = messages.GET_AV_MOVES;
		    msg.fromX = cell.x;
		    msg.fromY = cell.y;
		    socket.send(JSON.stringify(msg));

		    cells.selected = cell;
		    cells.hasSelected = true;
		    
		}

	    });
	}
    }

    var cells = new Cells(cellsArr);
    console.log(cells);

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


    var GAME_STARTED = false;
    var player;
    var turn = "white";
    
    const socket = new WebSocket("ws://localhost:3000");
    socket.onmessage = function(event){
	let msg = JSON.parse(event.data);

	switch(msg.kind) {
	    case messages.kind.GAME_START:
		GAME_STARTED = true;
		player = msg.player;
		window.alert("Game started: you are "+msg.player);
		break;
	    case messages.kind.GAME_DISCONNECTED:
		window.alert("Game disconnected");
		console.log(msg);
		break;
	    case messages.kind.GAME_WON:
		window.alert("Game won by: "+msg.player);
		break;
	    case messages.kind.PLAYER_MOVE:
		cells.removePiece(msg.fromX, msg.fromY);
		cells.addPiece(msg.toX, msg.toY, msg.piece, msg.player);
		cells.hasSelected = false;
		break;
	    case messages.kind.AVAILABLE_MOVES:
		cells.highlightCells(msg.data);
		break;
	    default:
		console.log(msg);
		
	} 
    };

    socket.onopen = function(){
	let msg = messages.INFO;
	msg.data = "Client message"
        socket.send(JSON.stringify(msg));
    };
    
})();
