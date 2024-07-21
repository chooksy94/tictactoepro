import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import { checkWinner, getBestMove } from './gameLogic';


const Game = () => {
  const initialBoard = Array(4).fill(null).map(() => Array(4).fill(null).map(() => Array(4).fill(null)));
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [firstMove, setFirstMove] = useState('Player');

  

  useEffect(() => {
    if (currentPlayer === 'O' && firstMove === 'Computer' && !winner) {
      const bestMove = getBestMove(board);
      if (bestMove) {
        handleClick(bestMove.layer, bestMove.row, bestMove.col);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayer, firstMove, winner, board,]);

  const handleClick = (layer, row, col) => {
    if (board[layer][row][col] || winner) return; // Prevent move if cell is occupied or there's a winner
  
    const newBoard = board.map((layerArr, lIndex) =>
      layerArr.map((rowArr, rIndex) =>
        rowArr.map((cell, cIndex) =>
          lIndex === layer && rIndex === row && cIndex === col ? currentPlayer : cell
        )
      )
    )

    setBoard(newBoard);
    const newWinner = checkWinner(newBoard);
    setWinner(newWinner);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  }

  const handleFirstMoveChange = (event) => {
    const move = event.target.value;
    setFirstMove(move);
    setCurrentPlayer(move === 'Player' ? 'X' : 'O');

    // Reset the board for a new game when selecting first move
    const resetBoard = initialBoard.map(layer => layer.map(row => row.slice()));
    setBoard(resetBoard);
    setWinner(null); // Clear the winner state

    if (move === 'Computer') {
      const bestMove = getBestMove(resetBoard);
      if (bestMove) {
        resetBoard[bestMove.layer][bestMove.row][bestMove.col] = 'O';
        setBoard(resetBoard);
        setCurrentPlayer('X');
      }
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setWinner(null);
    setCurrentPlayer('X');
    setFirstMove('Player');
  };

  return (
    <div className="game">
      <div>
        <label>
          <input
            type="radio"
            value="Player"
            checked={firstMove === 'Player'}
            onChange={handleFirstMoveChange}
          />
          Play with Friend 
        </label>
        <label>
          <input
            type="radio"
            value="Computer"
            checked={firstMove === 'Computer'}
            onChange={handleFirstMoveChange}
          />
          Play with Computer 
        </label>
      </div>
      <Board board={board} onClick={handleClick} />
      {winner && (
        <div>
          <p>Winner: {winner === 'X' ? 'Player' : 'Computer'}</p>
          <button onClick={resetGame}>Start A New Game</button>
        </div>
      )}
    </div>
  );
};

export default Game;
