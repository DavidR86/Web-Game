// Code chared between clients and server

(function(exports){

    exports.kind = {
	// Server to client
	GAME_START: 1,
	GAME_DISCONNECTED: 2,
	GAME_WON: 3,
	PLAYER_MOVE: 4,
	AVAILABLE_MOVES: 5,
	
	// Client to server
	GET_AV_MOVES: 6,
	CHECK_MOVE: 7,

	// Both
	INFO: 8
    };

    exports.player = {
	BLACK: "black",
	WHITE: "white"
    }

    exports.GAME_START = {
	kind: exports.kind.GAME_START,
	player: null
    }

    exports.GAME_WON = {
	kind: exports.kind.GAME_WON,
	player: null
    }

    exports.GAME_DISCONNECTED = {
	kind: exports.kind.GAME_DISCONNECTED
    }

    exports.PLAYER_MOVE = {
	kind: exports.kind.PLAYER_MOVE,
	player: null,
	fromX: null,
	toX: null,
	fromY: null,
	toY: null,
	piece: null,
	piece_color: null
    }

    exports.AVAILABLE_MOVES = {
	kind: exports.kind.AVAILABLE_MOVES,
	data: null
    }

    exports.GET_AV_MOVES = {
	kind: exports.kind.GET_AV_MOVES,
	fromX: null,
	fromY: null
    }

    exports.CHECK_MOVE = {
	kind: exports.kind.CHECK_MOVE,
	fromX: null,
	toX: null,
	fromY: null,
	toY: null
    }

    exports.INFO = {
	kind: exports.kind.INFO,
	data: "message"
    }
    

}(typeof exports === 'undefined' ? this.messages = {} : exports));
