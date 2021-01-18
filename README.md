# Centaur Chess
TU Delft Web and Database Technologies assignment

![chess image](media/chess1.png)

### Overview
A multiplayer web chess game with support for multiple rooms. 

### Building & Running
Clone the repository, make sure to have npm and nodejs installed, go to the project directory and run `npm start`. Then go to `localhost:3000` on your browser. You need 2 players for the game to start.

The game has an additional repository in the sf_server folder. This is a separate server where the stockfish.js chess engine runs. The main server can ask this other server for moves in order to play against the AI or simply to see what the recommended engine move is. Currently only the second feature is implemented.

### Left to implement:

**General:**
- Remove debug messages & build release version

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
