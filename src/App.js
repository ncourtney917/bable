import './App.css';
import Board from "./components/Board";
import Keyboard from './components/Keyboard';
import GameOver from './components/GameOver';
import { createContext, useState } from 'react';
import { boardDefault } from './Words';

export const AppContext = createContext();

function App() {
  const [board, setBoard] = useState(boardDefault);
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [gameOver, setGameOver] = useState({ gameOver: false, guessWord: false })
  const correctWord = "HENRY"

  const onSelectLetter = (keyVal) => {
    if (currAttempt.letterPos > 4) return;
    const newBoard = [...board]
    newBoard[currAttempt.attempt][currAttempt.letterPos] = keyVal
    setBoard(newBoard)
    setCurrAttempt({
      ...currAttempt, letterPos: currAttempt.letterPos + 1
    });
  };

  const onDelete = () => {
    if (currAttempt.letterPos === 0) return;
    const newBoard = [...board]
    newBoard[currAttempt.attempt][currAttempt.letterPos - 1] = ""
    setBoard(newBoard)
    setCurrAttempt({
      ...currAttempt, letterPos: currAttempt.letterPos - 1
    });
  };

  const onEnter = () => {
    if (currAttempt.letterPos !== 5) return;

    var guess = board[currAttempt.attempt].join("")
    setCurrAttempt({ attempt: currAttempt.attempt + 1, letterPos: 0 })

    if (guess === correctWord) {
      setGameOver({ gameOver: true, guessWord: true })
      return;
    }

    if (currAttempt.attempt === 5) {
      setGameOver({ gameOver: true, guessWord: false })
      return;
    }
  };


  return (
    <div className="App">
      <nav>
        <h1>Bable</h1>
      </nav>
      <AppContext.Provider value={{ board, setBoard, currAttempt, setCurrAttempt, onDelete, onEnter, onSelectLetter, correctWord, disabledLetters, setDisabledLetters, gameOver, setGameOver }}>
        <div className="game">
          <Board />
          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
