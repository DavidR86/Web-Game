(function () {
    let cellBlack = '<div class="black">g</div>';
    let cellWhite = '<div class="white">g</div>';

    function Cell(x, y) {
	this.x = x;
	this.y = y;
	this.piece = null;
    }

    // Create logical board
    function Board(cells) {
	this.cells = cells;
	this.selected = null;
    }
    // TODO: Add helper methods to manipulate logical board.
    Board.prototype.get = function(x, y){
	return this.cells[x][y];
    }
    Board.prototype.getUp = function(x, y){
	return this.cells[x][y-1];
    }
    Board.prototype.getDown = function(x, y){
	return this.cells[x][y+1];
    }
    Board.prototype.getLeft = function(x, y){
	return this.cells[x-1][y];
    }
    Board.prototype.getRight = function(x, y){
	return this.cells[x+1][y];
    }
    
    // Get physical boards from html file
    var boardContainer = document.getElementById('board_container');
    boardContainer.className = "container";
    var cells = new Array(8);
    
    // Create physical tiles in board
    for(var i = 0; i < 8; i++) {
	cells[i] = new Array(8);
	for(var j = 0; j < 8; j++) {
	    var cell = document.createElement("div");
	    cell.id = (i+1).toString()+"-"+(j+1).toString();
	    cell.innerHTML="*"; // remove this later

	    // Add logical cell to physical cell
	    cell.lcell = new Cell(i,j);
	    cells[i][j] = cell; // add cell to array
	    
	    if((i+j) % 2 == 0) {
		cell.className = "black";
		} else {
		    cell.className = "white";
		}
	    boardContainer.insertAdjacentElement("beforeend", cell);
	    cell.addEventListener("click", function cellClick(e) {
		console.log(e);

		if(board.selected==null){
		    board.selected=e.target;
		}else{
		    e.target.innerHTML=board.selected.innerHTML;
		    board.selected.innerHTML="*";
		    board.selected=null;
		}
	    });
	}
    }

    var board = new Board(cells);
    console.log(board);
    board.get(7,4).innerHTML="=PIECE=";
})();
