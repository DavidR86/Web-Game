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
	this.get(x,y).appendChild(piece);
    }

    
    
    Cells.prototype.highlight = function(x, y){
	
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
		console.log(e.currentTarget);
		cells.addPiece(e.currentTarget.x, e.currentTarget.y, "rook", "white");

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

    cells.addPiece(0, 0, "rook", "black");
    cells.addPiece(1, 0, "knight", "black");
    cells.addPiece(2, 0, "bishop", "black");
    cells.addPiece(3, 0, "queen", "black");
    cells.addPiece(4, 0, "king", "black");
    cells.addPiece(5, 0, "bishop", "black");
    cells.addPiece(6, 0, "knight", "black");
    cells.addPiece(7, 0, "rook", "black");

})();
