const socket = io();

let mySymbol = "";

const cells = document.querySelectorAll(".cell");
const roleText = document.getElementById("player-role");
const statusText = document.getElementById("status");

// get symbol
socket.on("player_symbol", (symbol) => {
    mySymbol = symbol;

    roleText.innerHTML = "You are Player " + symbol;
    statusText.innerHTML = "Waiting for another player...";
});

// player count
socket.on("player_count", (count) => {
    if (count < 2) {
        statusText.innerHTML = "Waiting for another player...";
    }
});

// start game
socket.on("game_start", (game) => {
    statusText.innerHTML = "Current Turn: " + game.turn;
});

// update board
socket.on("update_board", (game) => {
    game.board.forEach((value, index) => {
        cells[index].innerHTML = value;
    });

    if (game.started) {
        statusText.innerHTML = "Current Turn: " + game.turn;
    }
});

// game over
socket.on("game_over", (winner) => {
    statusText.innerHTML = winner + " wins!";

    if (winner === mySymbol) {
        alert("Kamu Menang!");
    } else {
        alert("Kamu Kalah!");
    }
});

// draw
socket.on("draw", () => {
    statusText.innerHTML = "Game Draw!";
    alert("Permainan Seri!");
});

// not your turn
socket.on("not_your_turn", () => {
    alert("Bukan giliranmu!");
});

// player disconnected
socket.on("player_left", () => {
    statusText.innerHTML = "Player disconnected.";

    cells.forEach(cell => {
        cell.innerHTML = "";
    });
});

// room full
socket.on("room_full", () => {
    statusText.innerHTML = "Room is full.";
});

// click cell
cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const index = cell.dataset.index;
        socket.emit("make_move", index);
    });
});