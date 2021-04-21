//Game Board object
const gameBoard = () => {
	const board = ["", "", "", "", "", "", "", "", ""];
	const setBoard = (index, sign) => {
		board[index] = `${sign}`;
	};
	const freeSpaces = () => {
		let freeIndexS = [];
		for (let i = 0; i < 9; i++) {
			if (board[i] === "") {
				freeIndexS.push(i);
			}
		}
		return freeIndexS;
	};
	return { board, setBoard, freeSpaces };
};

function checkFreeSpace(freeSpaces, index) {
	for (let i = 0; i < freeSpaces.length; i++) {
		if (freeSpaces[i] == index) {
			return true;
		}
	}
	return false;
}

const gameControllerPvP = () => {
	let sign = "X";
	let result = "continue";
	displayAnnouncer(result, sign);
	const game = gameBoard();
	const boards = document.querySelectorAll(".square");
	boards.forEach((board) => {
		board.addEventListener("click", function () {
			if (result === "continue") {
				if (game.board[board.id] === "") {
					game.setBoard(board.id, sign);
					if (sign === "X") {
						sign = "O";
					} else {
						sign = "X";
					}
					result = gameResultController(game.board, game.freeSpaces());
					displayController(game);
					displayAnnouncer(result, sign);
				}
			}
		});
	});
};

//Display game board
function displayController(game) {
	const imageX = document.createElement("img");
	imageX.src = "../styles/X_icon.png";
	imageX.style.width = "75%";
	const imageO = document.createElement("img");
	imageO.src = "../styles/O_icon.png";
	imageO.style.width = "75%";
	for (let i = 0; i < 9; i++) {
		const box = document.getElementById(`${i}`);
		if (!box.firstChild) {
			if (game.board[i] === "X") {
				box.appendChild(imageX);
			} else if (game.board[i] === "O") {
				box.appendChild(imageO);
			}
		}
	}
}

/**
 * 
	console.log(game.board);
	console.log(game.freeSpaces().length);
	console.log(result);
 */

//Display announcer
function displayAnnouncer(result, sign) {
	const announcer = document.querySelector("#announcer");
	announcer.style.color = "black";
	if (result == "continue") {
		announcer.innerText = `This is player ${sign}'s turn`;
	} else if (result === "X") {
		announcer.style.color = "red";
		announcer.innerText = "Player X win";
	} else if (result === "O") {
		announcer.style.color = "red";
		announcer.innerText = "Player O win";
	} else {
		announcer.style.color = "yellow";
		announcer.innerText = "Draw!";
	}
}

const clearAndCreate = () => {
	const container = document.querySelector("#container");
	const reset = () => {
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
	};
	const create = () => {
		for (let i = 0; i < 9; i++) {
			const index = document.createElement("div");
			index.classList = "square";
			index.id = i;
			container.appendChild(index);
		}
	};
	return { reset, create };
};

//Stop game and decide game result
function gameResultController(board, freeSpaces) {
	for (let i = 0; i <= 7; i += 3) {
		if (board[i] === board[i + 1] && board[i] === board[i + 2]) {
			if (board[i] === "X") {
				return "X";
			} else if (board[i] === "O") {
				return "O";
			}
		}
	}
	for (let j = 0; j <= 2; j++) {
		if (board[j] === board[j + 3] && board[j] === board[j + 6]) {
			if (board[j] === "X") {
				return "X";
			} else if (board[j] === "O") {
				return "O";
			}
		}
	}
	if (board[0] === board[4] && board[0] === board[8]) {
		if (board[0] === "X") {
			return "X";
		} else if (board[0] === "O") {
			return "O";
		}
	} else if (board[2] === board[4] && board[2] === board[6]) {
		if (board[2] === "X") {
			return "X";
		} else if (board[2] === "O") {
			return "O";
		}
	} else if (freeSpaces.length == 0) {
		return "draw";
	}
	return "continue";
}

(function () {
	const board = clearAndCreate();
	board.create();
	gameControllerPvP();
	let gameMode = "PvsP";
	const modeBtn = document.querySelector("#modeButton");
	modeBtn.addEventListener("click", function () {
		if (gameMode === "PvsP") {
			gameMode = "PvsB";
			modeBtn.innerText = "Player vs Bot";
		} else if (gameMode === "PvsB") {
			gameMode = "BvsP";
			modeBtn.innerText = "Bot vs Player";
		} else {
			gameMode = "PvsP";
			modeBtn.innerText = "Player vs Player";
		}
	});
	const resetBtn = document.querySelector("#resetButton");
	resetBtn.addEventListener("click", function () {
		board.reset();
		board.create();
		gameControllerPvP();
	});
})();
