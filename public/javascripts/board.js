(function () {
    let cellBlack = '<div class="black">g</div>';
    let cellWhite = '<div class="white">g</div>';
    
    let boardContainer = document.getElementById('board_container');
    boardContainer.className = "container";
    for(var i = 0; i < 8; i++) {
	for(var j = 0; j < 8; j++) {
	    let cell = document.createElement("div");
	    cell.id = (i+1).toString()+"-"+(j+1).toString();
	    cell.innerHTML = cell.id;
	    if((i+j) % 2 == 0) {
		cell.className = "black";
		} else {
		    cell.className = "white";
		}
	    boardContainer.insertAdjacentElement("beforeend", cell);
	    cell.addEventListener("click", function cellClick(e) {
		console.log(e);
		window.alert("clicked cell: "+e.target.id);
	    });
	}
    }
})();
