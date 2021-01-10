const { Chess } = require('chess.js')

// Neccessary code for each single instance of a game between two players.
var game = function() {
    // Private fields
    this.turn = "white";
    this.conversion = ["a", "b", "c", "d", "e", "f", "g", "h"];

    this.lToN = function(l){
	return this.conversion.lastIndexOf(l);
    }

    this.nToL = function(n){
	return this.conversion[n];
    }

    this.SANtoN = function(pos){
	pos=pos.replace("+", "");
	pos=pos.replace("#", "");
	if(pos.length===3){
	    return {x:(this.lToN(pos.charAt(1))), y:(8-Number(pos.charAt(2)))};
	}else if(pos.length===4){
	    return {x:(this.lToN(pos.charAt(2))), y:(8-Number(pos.charAt(3)))};
	}else{
	    return {x:(this.lToN(pos.charAt(0))), y:(8-Number(pos.charAt(1)))};
	}
    }

    this.NtoSAN = function(x, y){
	return this.nToL(x)+""+((7-y)+1);
    }

    this.pToPiece = function(p){
	switch(p.toLowerCase()) {
	    case "p": return "pawn";
		break;
	    case "r": return "rook";
		break;
	    case "k": return "king";
		break;
	    case "q": return "queen";
		break;
	    case "b": return "bishop";
		break;
	    case "n": return "knight";
		break;
	    default:
		return null;
		break;
	} 
    }

    this.chess = new Chess()
    console.log(this.chess.ascii())
}

game.prototype.getAvailableMoves = function(fromX, fromY){
    var moves = this.chess.moves({square: this.nToL(fromX)+""+((7-fromY)+1)});
    console.log(moves);
    var cMoves = [];
    moves.forEach(move => {
	if(!(move===null)){
	    cMoves.push(this.SANtoN(move));
	}
    });
    console.log(cMoves);
    return cMoves;
}

game.prototype.checkMove = function(fromX, toX, fromY, toY){
    var move = this.chess.move({from: this.NtoSAN(fromX, fromY), to: this.NtoSAN(toX, toY)});
    // console.log(move);

    if(move===null){
	return null;
    }else{
	console.log(this.chess.ascii());
	return {fromX: fromX, fromY: fromY, toX: toX, toY:toY, player: (this.chess.turn()==="b") ? "black" : "white", piece: this.pToPiece(move.piece), piece_color: (move.color==="b") ? "black" : "white"}
    }
}


module.exports = game;
