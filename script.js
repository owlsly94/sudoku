var numSelected = null;
var tileSelected = null;
var errors = 0;
var board;
var solution;

window.onload = function () {
    setGame();
}

function setGame() {
    // Fetch initial game data
    fetchNewGame();

    // Only create digits if not already created
    if (!document.getElementById("digits").hasChildNodes()) {
        // Digits 1-9
        for (let i = 1; i <= 9; i++) {
            let number = document.createElement("div");
            number.id = i;
            number.innerText = i;
            number.addEventListener("click", selectNumber);
            number.classList.add("number");
            document.getElementById("digits").appendChild(number);
        }
    }

    // Board 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[r][c] != "-") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            if (r == 0 || r == 8) {
                tile.classList.add("horizontal-line2");
            }
            if (r == 8 || r == 8) {
                tile.classList.add("horizontal-line3");
            }
            if (c == 0) {
                tile.classList.add("vertical-line2");
            }
            if (c == 8) {
                tile.classList.add("vertical-line3");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }

    // Reset errors count
    errors = 0;
    document.getElementById("errors").innerText = errors;
}

function fetchNewGame() {
    // Fetch data from games.json file
    fetch('games.json')
        .then(response => response.json())
        .then(data => {
            // Select a random game from the array
            const randomGame = data[Math.floor(Math.random() * data.length)];
            board = randomGame.board;
            solution = randomGame.solution;
        })
        .catch(error => console.error('Error fetching new game:', error));
}

function selectNumber() {
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (numSelected) {
        if (this.innerText != "") {
            return;
        }

        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[r][c] == numSelected.id) {
            this.innerText = numSelected.id;
        } else {
            errors += 1;
            document.getElementById("errors").innerText = errors;
        }
    }
}

// Function to be called when clicking the "New Game" button
function newGame() {
    // Clear the board and fetch a new game
    document.getElementById("board").innerHTML = "";
    setGame();
}

// Function to be called when clicking the "Resi" button
function solveSudoku() {
    // Check if the board is already solved
    if (boardIsComplete()) {
        alert("Tabla je već rešena!");
        return;
    }

    // Fill the board with the solution
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tileId = r.toString() + "-" + c.toString();
            let tile = document.getElementById(tileId);

            // Check if the tile is not a starting tile
            if (!tile.classList.contains("tile-start")) {
                tile.innerText = solution[r][c];
            }
        }
    }
}

// Helper function to check if the board is complete
function boardIsComplete() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tileId = r.toString() + "-" + c.toString();
            let tile = document.getElementById(tileId);

            // Check if any non-starting tile is still empty
            if (!tile.classList.contains("tile-start") && tile.innerText === "") {
                return false;
            }
        }
    }
    return true;
}
