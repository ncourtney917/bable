import './App.css';
import Board from "./components/Board";
import Keyboard from './components/Keyboard';
import GameOver from './components/GameOver';
import { createContext, useState } from 'react';
import Words from './components/Words';

export const AppContext = createContext();

function App() {
  const correctWord = "NICHOLAS"
  const letterCount = correctWord.length

  /* Set the width of the board based on the number of letters in the game */
  let root = document.documentElement;
  let width = (98 * letterCount).toString();
  root.style.setProperty("--screen-width", width + "px");

  const [board, setBoard] = useState(Words(letterCount));
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [gameOver, setGameOver] = useState({ gameOver: false, guessWord: false })

  const onSelectLetter = (keyVal, letterCount) => {
    if (currAttempt.letterPos > letterCount - 1) return;
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

  const onEnter = (letterCount) => {
    if (currAttempt.letterPos !== letterCount) return;

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
      <AppContext.Provider value={{ board, setBoard, currAttempt, setCurrAttempt, onDelete, onEnter, onSelectLetter, correctWord, disabledLetters, setDisabledLetters, gameOver, setGameOver, letterCount }}>
        <div className="game">
          <Board />
          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
