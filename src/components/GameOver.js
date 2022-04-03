import React, { useContext } from 'react';
import { AppContext } from '../pages/playgame';

function GameOver() {
    const { gameOver, correctWord, currAttempt } = useContext(AppContext);

    // Create button that refreshes page
    const refreshPage = () => {
        window.location.reload();
    }
    return (
        <div className="gameOver">
            <h2>{gameOver.guessWord ? "You won!" : "Game over, you lost!"}</h2>
            <h1>Correct Answer: {correctWord}</h1>
            {gameOver.guessWord && (<h2> You guessed in {currAttempt.attempt} attempt{currAttempt.attempt !== 1 && "s"}</h2>)}
            <button className="refresh" onClick={refreshPage}>Play again?</button>
        </div>
    )
}

export default GameOver