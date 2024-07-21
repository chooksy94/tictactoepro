// App.js
import React from 'react';
import './App.css';
import Game from './Game';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>TicTacToe Pro</h1>
        <p><a href="https://www.youtube.com/watch?v=USEjXNCTvcc">Learn How to play</a></p>
        
      </header>
      <main>
        <Game />
      </main>
    </div>
  );
}

export default App;
