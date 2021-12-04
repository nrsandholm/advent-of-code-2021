const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'day_04.txt'), 'utf8');

const initGame = (input) => {
  return input
    .split('\n')
    .reduce((game, row, index) => {
      // First row contains draft numbers
      if (index === 0) {
        // console.log('Numbers');
        game.numbers = row.trim().split(',').map(v => parseInt(v));
      }
      // Empty row indicates new board
      else if (row.trim().length === 0) {
        // console.log('Ínit new board');
        game.boards.push([]);
      }
      // Numbers for latest board
      else {
        const lastBoard = game.boards.pop();
        const numbers = row.trim().replace(/\s{2,}/g, ' ').split(' ').map(v => parseInt(v));
        // console.log('Add numbers to latest board', numbers);
        lastBoard.push(numbers);
        game.boards.push(lastBoard);
      }
      return game;
  }, {
    numbers: null,
    boards: []
  });
};

const markHitsOnBoard = (board, number) => {
  return board.map(row => row.map(num => num === number ? num + '' : num));
};

const markHitsOnBoards = (boards, number) => {
  return boards.map(board => markHitsOnBoard(board, number));
};

const countSumOfUnmarked = (board) => {
  let sum = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const value = board[i][j];
      if (typeof value === 'number') sum += value;
    }
  }
  return sum;
};

const checkRows = (board) => {
  for (const row of board) {
    if (row.every(v => typeof v === 'string')) {
      return true;
    }
  }
  return false;
};

const checkColumns = (board) => {
  const cols = (board[0] || []).length;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < board.length; j++) {
      if (typeof board[j][i] === 'number') break;
      if (j + 1 === board.length) return true;
    }
  }
  return false;
};

const checkBoard = (board) => {
  return checkRows(board) || checkColumns(board);
};

// Part 1
(function() {
  const checkBoards = (boards) => {
    for (let board of boards) {
      if (checkBoard(board)) {
        return board;
      }
    }
  };

  const play = (game) => {
    for (let number of game.numbers) {
      game.boards = markHitsOnBoards(game.boards, number);
      const board = checkBoards(game.boards);
      if (board) {
        console.log(board);
        const sum = countSumOfUnmarked(board);
        console.log(sum * number);
        return;
      }
    }
  };

  const game = initGame(input);
  play(game);
})();

// Part 2
(function() {
  const checkBoards = (boards) => {
    const boardsWithBingo = [];
    for (let board of boards) {
      if (checkBoard(board)) {
        boardsWithBingo.push(board);
      }
    }
    return boardsWithBingo;
  };

  const play = (game) => {
    for (let number of game.numbers) {
      game.boards = markHitsOnBoards(game.boards, number);
      const boards = checkBoards(game.boards);

      if (boards.length > 0 && game.boards.length === 1) {
        const board = boards.pop();
        console.log(board);
        const sum = countSumOfUnmarked(board);
        console.log(sum * number);
        return;
      }
      else if (boards.length > 0) {
        game.boards = game.boards.filter(b => !boards.includes(b));
        // console.log('Removed', boards.length, ',', game.boards.length, 'left');
      }
    }
  };

  const game = initGame(input);
  play(game);
})();
