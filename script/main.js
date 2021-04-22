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

//Game controller for PvsP
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
					result = gameResultController(game);
					displayController(game);
					displayAnnouncer(result, sign);
				}
			}
		});
	});
};

//Game controller for PvsB,BvsP
const gameControllerPvB = (mode) => {
	let player, bot;
	const game = gameBoard();
	let result = "continue";
	const boards = document.querySelectorAll(".square");
	if (mode === "PvsB") {
		player = "X";
		bot = "O";
	} else if (mode === "BvsP") {
		player = "O";
		bot = "X";
		game.setBoard(Math.ceil(Math.random() * 9 - 1), bot);
		displayController(game);
	}
	displayAnnouncerPvsB(result, player);
	if (result === "continue") {
		boards.forEach((board) => {
			board.addEventListener("click", function () {
				if (result === "continue") {
					if (game.board[board.id] === "") {
						game.setBoard(board.id, player);
						game.setBoard(findBestMove(game, player, bot), bot);
						result = gameResultController(game);
						displayController(game);
						displayAnnouncerPvsB(result, player);
					}
				}
			});
		});
	}
};

//Find best moves for bot width minimax algorithm
function findBestMove(game, player, bot) {
	let bestValue = -10000;
	let bestMove = -1;
	for (let i = 0; i < 9; i++) {
		if (game.board[i] === "") {
			game.setBoard(i, bot);
			let moveValue = miniMax(game, player, bot, 0, false);
			game.setBoard(i, "");
			if (moveValue > bestValue) {
				bestValue = moveValue;
				bestMove = i;
			}
		}
	}
	return bestMove;
}
function miniMax(game, player, bot, dept, isMax) {
	let result = gameResultController(game);
	if (result === bot) {
		return 100;
	} else if (result === player) {
		return -100;
	} else if (result === "draw") {
		return 0;
	}
	if (isMax) {
		let bestScore = -10000;
		for (let i = 0; i < 9; i++) {
			if (game.board[i] === "") {
				game.setBoard(i, bot);
				let newScore = miniMax(game, player, bot, dept + 1, !isMax) - dept;
				bestScore = Math.max(bestScore, newScore);
				game.setBoard(i, "");
			}
		}
		return bestScore;
	} else {
		let worstScore = 10000;
		for (let i = 0; i < 9; i++) {
			if (game.board[i] === "") {
				game.setBoard(i, player);
				let newScore = miniMax(game, player, bot, dept + 1, !isMax) + dept;
				worstScore = Math.min(worstScore, newScore);
				game.setBoard(i, "");
			}
		}
		return worstScore;
	}
}

//Display game board
function displayController(game) {
	const imageX = document.createElement("img");
	imageX.src = "/styles/xIcon.png";
	imageX.style.width = "75%";
	const imageO = document.createElement("img");
	imageO.src = "/styles/oIcon.png";
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

//Display announcer for pvp and pvB
function displayAnnouncer(result, sign) {
	const announcer = document.querySelector("#announcer");
	announcer.style.color = "black";
	if (result == "continue") {
		announcer.innerText = `This is player ${sign}'s turn`;
	} else if (result === "X") {
		announcer.style.color = "darkblue";
		announcer.innerText = "Player X win!";
	} else if (result === "O") {
		announcer.style.color = "red";
		announcer.innerText = "Player O win!";
	} else {
		announcer.style.color = "#ff5733";
		announcer.innerText = "Draw!";
	}
}
function displayAnnouncerPvsB(result, player) {
	const announcer = document.querySelector("#announcer");
	announcer.style.color = "black";
	if (result == "continue") {
		announcer.innerText = `Your turn:`;
	} else if (result === player) {
		announcer.style.color = "green";
		announcer.innerText = "You win!";
	} else if (result === "draw") {
		announcer.style.color = "#ff5733";
		announcer.innerText = "Draw!";
	} else {
		announcer.style.color = "red";
		announcer.innerText = "You lose!";
	}
}

const clearAndCreate = () => {
	const container = document.querySelector("#container");
	const clear = () => {
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
	return { clear, create };
};

//Stop game and decide game result
function gameResultController(game) {
	for (let i = 0; i <= 7; i += 3) {
		if (
			game.board[i] === game.board[i + 1] &&
			game.board[i] === game.board[i + 2]
		) {
			if (game.board[i] === "X") {
				return "X";
			} else if (game.board[i] === "O") {
				return "O";
			}
		}
	}
	for (let j = 0; j <= 2; j++) {
		if (
			game.board[j] === game.board[j + 3] &&
			game.board[j] === game.board[j + 6]
		) {
			if (game.board[j] === "X") {
				return "X";
			} else if (game.board[j] === "O") {
				return "O";
			}
		}
	}
	if (game.board[0] === game.board[4] && game.board[0] === game.board[8]) {
		if (game.board[0] === "X") {
			return "X";
		} else if (game.board[0] === "O") {
			return "O";
		}
	} else if (
		game.board[2] === game.board[4] &&
		game.board[2] === game.board[6]
	) {
		if (game.board[2] === "X") {
			return "X";
		} else if (game.board[2] === "O") {
			return "O";
		}
	} else if (game.freeSpaces().length == 0) {
		return "draw";
	}
	return "continue";
}

(function () {
	const board = clearAndCreate();
	const modeButton = document.querySelector("#chooseMode");
	let gameMode = modeButton.value;
	chooseMode(gameMode);
	modeButton.addEventListener("change", function () {
		gameMode = modeButton.value;
		chooseMode(gameMode);
	});
	const resetBtn = document.querySelector("#resetButton");
	resetBtn.addEventListener("click", function () {
		chooseMode(gameMode);
	});
	function chooseMode(gameMode) {
		board.clear();
		board.create();
		if (gameMode === "PvsP") {
			gameControllerPvP();
		}
		if (gameMode === "PvsB") {
			gameControllerPvB("PvsB");
		}
		if (gameMode === "BvsP") {
			gameControllerPvB("BvsP");
		}
	}
})();
