import React, { useContext, useEffect, useState } from 'react';
import { AppContext, gender } from '../pages/playgame';
import Confetti from 'react-confetti';
import {useParams} from 'react-router-dom';
import Popup from 'reactjs-popup';


function GameOver() {
    const { gameOver, correctWord, currAttempt, gender } = useContext(AppContext);
    const { gameId } = useParams();
    const [color, setColor] = useState(['#f44336','#e91e63','#9c27b0','#673ab7','#3f51b5','#2196f3','#03a9f4','#FF5722','#795548']	)
    const height = window.innerHeight + 150
    const width = window.innerWidth

    // Get gender from url string and set confetti color
    useEffect(()=>{
        try {
            if (gender === "Boy"){
                setColor(['#89CFF0'])
            }else if (gender === "Girl"){
                setColor(['#FF69B4'])
            }
        }catch(e) {
            console.log(e)
        }
    },[]);

    // Create screen for winners and losers
    if (gameOver.guessWord) {
        return (
            <div>
                <Popup trigger={<button className="results-button submit">See results</button>} defaultOpen="true" position="top center" arrow="false" modal="true">
                    <div className="gameOver popup">
                        <h1>It's a {gender}!</h1>
                        <hr></hr>
                        <div className="popup-body">
                            <h3>The baby's name is:</h3>
                            <h1>{correctWord}</h1>
                            {gameOver.guessWord && (<h3 className="margin-top"> You guessed it correcly in {currAttempt.attempt} attempt{currAttempt.attempt !== 1 && "s"}</h3>)}
                        </div>
                        <p className="info-text">Created by Nick Courtney</p>
                    </div>
                </Popup>
                <Confetti width={width} height={height} colors={color}/>
            </div>
        )
    }
    else{
        return(
            <div>
                <Popup trigger={<button className="results-button submit">See results</button>} defaultOpen="true" position="top center" arrow="false" modal="true">
                    <div className="gameOver popup">
                        <h1>It's a {gender}!</h1>
                        <hr></hr>
                        <div className="popup-body">
                            <h3>The baby's name is:</h3>
                            <h1>{correctWord}</h1>
                            <h3 className="margin-top">Don't worry, we won't tell the baby you lost :)</h3>
                        </div>
                        <p className="info-text">Created by Nick Courtney</p>
                    </div>
                </Popup>
            </div>
        )
    }
}

export default GameOver