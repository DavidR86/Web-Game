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
	    return {x:(this.lToN(pos.charAt(pos.length-2))), y:(8-Number(pos.charAt(pos.length-1)))};
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
    //console.log(this.chess.ascii())
}

game.prototype.bestmoveToCoord = function(bestmove){
    bestmove = bestmove.slice(9, -12);
    return {from: this.SANtoN(bestmove.substring(0,2)), to: this.SANtoN(bestmove.substring(2,4))}
}

game.prototype.getAvailableMoves = function(fromX, fromY){
    var moves = this.chess.moves({square: this.nToL(fromX)+""+((7-fromY)+1)});
    var cMoves = [];
    moves.forEach(move => {
	if(!(move===null)){
	    if(move === "O-O") move = (this.chess.turn() === "w") ? "g1" : "g8"; //castling
	    if(move === "O-O-O") move = (this.chess.turn() === "w") ? "c1" : "c8";
	    cMoves.push(this.SANtoN(move));
	}
    });
    return cMoves;
}

game.prototype.checkMove = function(fromX, toX, fromY, toY){
    var move = this.chess.move({from: this.NtoSAN(fromX, fromY), to: this.NtoSAN(toX, toY)});

    if(move===null){
	return null;
    }else{
	var additionalMove = false;
	var additionalCoord = {from: null, to: null};
	var additionalPiece = null;
	console.log(this.chess.ascii());
	if(move.san === "O-O-O"){
	    additionalMove = true;
	    additionalCoord.from = this.SANtoN((this.chess.turn() === "b") ? "a1" : "a8")
	    additionalCoord.to = this.SANtoN((this.chess.turn() === "b") ? "d1" : "d8")
	    additionalPiece = "rook";
	    
	}else if(move.san === "O-O"){
	    additionalMove = true;
	    additionalCoord.from = this.SANtoN((this.chess.turn() === "b") ? "h1" : "h8")
	    additionalCoord.to = this.SANtoN((this.chess.turn() === "b") ? "f1" : "f8")
	    additionalPiece = "rook";
	}
		return {fromX: fromX, fromY: fromY, toX: toX, toY:toY, player: (this.chess.turn()==="b") ? "black" : "white", piece: this.pToPiece(move.piece), piece_color: (move.color==="b") ? "black" : "white", additionalMove: additionalMove, additionalCoord: additionalCoord, additionalPiece: additionalPiece, san: move.san}
    }
}

game.prototype.checkGameOver = function(){
    var checkMate = this.chess.in_checkmate();

    if(checkMate){
	return {game_over: true, type: "checkmate", winner:(this.chess.turn()==="w") ? "black" : "white"};
    }else{
	return {game_over: false};
    }
    
}

game.prototype.getFen = function(){
    return this.chess.fen();
}


module.exports = game;
