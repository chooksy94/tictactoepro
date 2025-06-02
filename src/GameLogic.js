
export const checkWinner = (board) => {
  const lines = [];

  // Rows and columns on each layer
  for (let l = 0; l < 4; l++) {
    for (let r = 0; r < 4; r++) {
      lines.push([[l, r, 0], [l, r, 1], [l, r, 2], [l, r, 3]]); // Rows
      lines.push([[l, 0, r], [l, 1, r], [l, 2, r], [l, 3, r]]); // Columns
    }
  }

  // Across layers
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      lines.push([[0, r, c], [1, r, c], [2, r, c], [3, r, c]]); // Vertical across layers
    }
  }

  // Major diagonals (more can be added for full coverage)
  lines.push([[0, 0, 0], [1, 1, 1], [2, 2, 2], [3, 3, 3]]);
  lines.push([[0, 0, 3], [1, 1, 2], [2, 2, 1], [3, 3, 0]]);
  lines.push([[0, 3, 0], [1, 2, 1], [2, 1, 2], [3, 0, 3]]);
  lines.push([[0, 3, 3], [1, 2, 2], [2, 1, 1], [3, 0, 0]]);

  for (let line of lines) {
    const [a, b, c, d] = line;
    if (
      board[a[0]][a[1]][a[2]] &&
      board[a[0]][a[1]][a[2]] === board[b[0]][b[1]][b[2]] &&
      board[a[0]][a[1]][a[2]] === board[c[0]][c[1]][c[2]] &&
      board[a[0]][a[1]][a[2]] === board[d[0]][d[1]][d[2]]
    ) {
      return board[a[0]][a[1]][a[2]];
    }
  }

  return null;
};

//Simulate a move and return a new board state
const simulateMove = (board, move, player) => {
  const newBoard = board.map(layer =>
    layer.map(row => row.slice())
  );
  newBoard[move.layer][move.row][move.col] = player;
  return newBoard;
};

// Improved AI: Try to win, block, then fallback to random
export const getBestMove = (board) => {
  const emptyCells = [];

  for (let l = 0; l < 4; l++) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!board[l][r][c]) {
          emptyCells.push({ layer: l, row: r, col: c }); 
        }
      }
    }
  }

  // 1. Try to win with a move
  
  for (let move of emptyCells) {
    const testBoard = simulateMove(board, move, 'O');
    if (checkWinner(testBoard) === 'O') return move;
  }

  // 2. Block the player
  for (let move of emptyCells) {
    const testBoard = simulateMove(board, move, 'X');
    if (checkWinner(testBoard) === 'X') return move;
  }

  // 3. Random move as fallback
  if (emptyCells.length > 0) {
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  return null;
};
