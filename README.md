# Centaur Chess
TU Delft Web and Database Technologies assignment

![chess image](media/chess1.png)

### Overview
A multiplayer web chess game with support for multiple rooms. 

### Building & Running
Clone the repository, make sure to have npm and nodejs installed, go to the project directory and run `npm start`. Then go to `localhost:3000` on your browser. You need 2 players for the game to start.

### Using the integrated stockfish engine server
The game has an additional repository in the sf_server folder. This is a separate server where the stockfish.js chess engine runs. The main server can ask this other server for moves in order to play against the AI or simply to see what the recommended engine move is. Currently only the second feature is implemented.
To run this server, go to the sf_server folder, and run `npm start`. You also have to go to the main server's package.json and set the false flag to true, or run `node app.js 3000 true`. The main server should now connect to the chess AI server on port 3141. Once inside the game, you can open the web console and type `GameFunctions.enableHelp()` to enable the "Best Move" button. After clicking on it the board is sent to the AI server, which returns the ideal move after 3s of thinking.

### Left to implement:

**General:**
- ~~Remove debug messages & build release version~~

**Splash screen:**
- ~~Add css~~
-~~Add panel for statistics~~
- ~~Better css~~

**Server:**
- ~~Game over, game start & game disconnected message sending~~
- ~~Castling~~, promotions, victory detection (~~checkmate~~, draw, stalemate) & en passe
- ~~Add support for statistics~~
- ~~Lobbys (Let people choose make a private room)~~

**Client:**
- ~~Board rotation when playing black pieces~~
- ~~Highlight last played piece~~
- ~~Change tab title content~~
- ~~Sound~~
- ~~Information panel with clock & statistics~~
- ~~Add favicon~~
- ~~Better css~~
