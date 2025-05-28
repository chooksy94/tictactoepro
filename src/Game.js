import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import { checkWinner, getBestMove } from './GameLogic';

const Game = () => {
  const initialBoard = Array(4)
    .fill(null)
    .map(() => Array(4).fill(null).map(() => Array(4).fill(null)));

  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [firstMove, setFirstMove] = useState('Player');
  const [scores, setScores] = useState({
    player1: 0,
    player2: 0,
    computer: 0,
  });

  useEffect(() => {
    if (currentPlayer === 'O' && firstMove === 'Computer' && !winner) {
      const bestMove = getBestMove(board);
      if (bestMove) {
        handleClick(bestMove.layer, bestMove.row, bestMove.col);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayer, firstMove, winner, board]);

  const handleClick = (layer, row, col) => {
    if (board[layer][row][col] || winner) return;

    const newBoard = board.map((layerArr, lIndex) =>
      layerArr.map((rowArr, rIndex) =>
        rowArr.map((cell, cIndex) =>
          lIndex === layer && rIndex === row && cIndex === col
            ? currentPlayer
            : cell
        )
      )
    );

    setBoard(newBoard);
    const newWinner = checkWinner(newBoard);
    setWinner(newWinner);

    if (newWinner) {
      setScores((prevScores) => {
        if (firstMove === 'Computer') {
          return {
            ...prevScores,
            player1:
              newWinner === 'X' ? prevScores.player1 + 1 : prevScores.player1,
            computer:
              newWinner === 'O' ? prevScores.computer + 1 : prevScores.computer,
          };
        } else {
          return {
            ...prevScores,
            player1:
              newWinner === 'X' ? prevScores.player1 + 1 : prevScores.player1,
            player2:
              newWinner === 'O' ? prevScores.player2 + 1 : prevScores.player2,
          };
        }
      });
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const handleFirstMoveChange = (event) => {
    const move = event.target.value;
    setFirstMove(move);
    setCurrentPlayer(move === 'Player' ? 'X' : 'O');

    // Reset the board
    const resetBoard = initialBoard.map((layer) =>
      layer.map((row) => row.slice())
    );
    setBoard(resetBoard);
    setWinner(null);

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
  };

  const resetScores = () => {
    setScores({
      player1: 0,
      player2: 0,
      computer: 0,
    });
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

<div className="scoreboard" style={{ marginTop: '20px', textAlign: 'center' }}>
  {firstMove === 'Computer' ? (
    <p>Score — Player: {scores.player1} | Computer: {scores.computer}</p>
  ) : (
    <p>Score — Player 1: {scores.player1} | Player 2: {scores.player2}</p>
  )}
  <button onClick={resetScores}>Reset Scores</button>
</div>

      {winner && (
        <div>
          <p>Winner: {winner === 'X' ? 'Player 1' : firstMove === 'Computer' ? 'Computer' : 'Player 2'}</p>
          <button onClick={resetGame}>Start A New Game</button>
        </div>
      )}
    </div>
  );
};

export default Game;
