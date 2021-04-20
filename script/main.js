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

const gameControllerPvP = () => {
	let sign = "X";
	const game = gameBoard();
	const boards = document.querySelectorAll(".square");
	boards.forEach((board) => {
		board.addEventListener("click", function () {
			if (checkFreeSpace(game.freeSpaces(), board.id)) {
				game.setBoard(board.id, sign);
				if (sign == "X") {
					board.innerText = "X";
					sign = "O";
				} else {
					board.innerText = "O";
					sign = "X";
				}
				console.log(game.board);
				console.log(game.freeSpaces().length);
				console.log(gameResultController(game.board, game.freeSpaces()));
			}
		});
	});
};

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
}
(function () {
	const container = document.querySelector("#container");
	for (let i = 0; i < 9; i++) {
		const index = document.createElement("div");
		index.classList = "square";
		index.id = i;
		container.appendChild(index);
	}
	gameControllerPvP();
})();

function checkFreeSpace(freeSpaces, index) {
	for (let i = 0; i < freeSpaces.length; i++) {
		if (freeSpaces[i] == index) {
			return true;
		}
	}
	return false;
}
