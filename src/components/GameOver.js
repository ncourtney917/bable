import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../pages/playgame';
import Confetti from 'react-confetti';
import {useParams} from 'react-router-dom';
import {key} from "../App";

var CryptoJS = require("crypto-js");



function GameOver() {
    const { gameOver, correctWord, currAttempt } = useContext(AppContext);
    const { gameId } = useParams();
    const [color, setColor] = useState(['#f44336','#e91e63','#9c27b0','#673ab7','#3f51b5','#2196f3','#03a9f4','#FF5722','#795548']	)
    const height = window.innerHeight
    const width = window.innerWidth
    const boy = ['#89CFF0']
    const girl = ['#FF69B4']

    // Get gender from url string and set confetti color
    useEffect(()=>{
        // Decrpyt gameId
        var originalGameId = gameId.replace(/gobills/g, '+' ).replace(/joshallen/g, '/').replace(/babble/g, '=');
        var bytes = CryptoJS.AES.decrypt(originalGameId, key);
        try {
            var decodedName = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            var gender = decodedName.slice(-1)
            if (gender === "M"){
                setColor(boy)
            }else if (gender === "F"){
                setColor(girl)
            }
        }catch(e) {
            console.log(e)
        }
    },[]);

    // Create screen for winners and losers
    if (gameOver.guessWord) {
        return (
            <div className="gameOver">
                <h2>You won!</h2>
                <h1>Correct Answer: {correctWord}</h1>
                {gameOver.guessWord && (<h2> You guessed in {currAttempt.attempt} attempt{currAttempt.attempt !== 1 && "s"}</h2>)}
                <Confetti width={width} height={height} colors={color}/>
            </div>
        )
    }
    else{
        return(
            <div className="gameOver">
                <h2>Game over, you lost!</h2>
                <h1>Correct Answer: {correctWord}</h1>
            </div>
        )
    }
}

export default GameOver