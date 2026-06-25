const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let game = {
    players: {
        X: null,
        O: null
    },
    board: ["", "", "", "", "", "", "", "", ""],
    turn: "X",
    started: false
};

// Check winner
function checkWinner(board) {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    for (let pattern of winPatterns) {
        const [a,b,c] = pattern;

        if (
            board[a] &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {
            return board[a];
        }
    }

    return null;
}

// Count active players
function getPlayerCount() {
    let count = 0;
    if (game.players.X) count++;
    if (game.players.O) count++;
    return count;
}

// Reset board only
function resetBoard() {
    game.board = ["", "", "", "", "", "", "", "", ""];
    game.turn = "X";
    game.started = false;
}

// Clean ghost sockets
function cleanGhostPlayers() {
    if (game.players.X && !io.sockets.sockets.get(game.players.X)) {
        game.players.X = null;
    }

    if (game.players.O && !io.sockets.sockets.get(game.players.O)) {
        game.players.O = null;
    }
}

io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    let assignedSymbol = null;

    // cleanup ghost players
    cleanGhostPlayers();

    // assign role
    if (!game.players.X) {
        game.players.X = socket.id;
        assignedSymbol = "X";
    } else if (!game.players.O) {
        game.players.O = socket.id;
        assignedSymbol = "O";
    } else {
        socket.emit("room_full");
        return;
    }

    socket.emit("player_symbol", assignedSymbol);

    io.emit("player_count", getPlayerCount());

    // start game if 2 players ready
    if (game.players.X && game.players.O) {
        game.started = true;
        io.emit("game_start", game);
    }

    // make move
    socket.on("make_move", (index) => {
        if (!game.started) return;
        if (game.board[index] !== "") return;

        // validate turn
        if (game.players[game.turn] !== socket.id) {
            socket.emit("not_your_turn");
            return;
        }

        // set move
        game.board[index] = game.turn;

        // winner check
        const winner = checkWinner(game.board);

        if (winner) {
            game.started = false;
            io.emit("update_board", game);
            io.emit("game_over", winner);
            return;
        }

        // draw check
        const isDraw = game.board.every(cell => cell !== "");

        if (isDraw) {
            game.started = false;
            io.emit("update_board", game);
            io.emit("draw");
            return;
        }

        // switch turn
        game.turn = game.turn === "X" ? "O" : "X";

        io.emit("update_board", game);
    });

    // disconnect
    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);

        if (game.players.X === socket.id) {
            game.players.X = null;
        }

        if (game.players.O === socket.id) {
            game.players.O = null;
        }

        resetBoard();

        io.emit("player_left");
        io.emit("player_count", getPlayerCount());
    });
});

// periodic sync
setInterval(() => {
    io.emit("update_board", game);
}, 1000);

http.listen(3000, () => {
    console.log("Server running on port 3000");
});