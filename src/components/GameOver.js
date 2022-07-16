import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../pages/playgame';
import Confetti from 'react-confetti';
import {useParams} from 'react-router-dom';
import {key} from "../App";
import Popup from 'reactjs-popup';

var CryptoJS = require("crypto-js");



function GameOver() {
    const { gameOver, correctWord, currAttempt } = useContext(AppContext);
    const { gameId } = useParams();
    const [color, setColor] = useState(['#f44336','#e91e63','#9c27b0','#673ab7','#3f51b5','#2196f3','#03a9f4','#FF5722','#795548']	)
    const [gender, setGender] = useState("baby")
    const height = window.innerHeight
    const width = window.innerWidth

    // Get gender from url string and set confetti color
    useEffect(()=>{
        // Decrpyt gameId
        var originalGameId = gameId.replace(/gobills/g, '+' ).replace(/joshallen/g, '/').replace(/babble/g, '=');
        var bytes = CryptoJS.AES.decrypt(originalGameId, key);
        try {
            var decodedName = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            var gender = decodedName.slice(-1)
            if (gender === "M"){
                setColor(['#89CFF0'])
                setGender("Boy")
            }else if (gender === "F"){
                setColor(['#FF69B4'])
                setGender("Girl")
            }
        }catch(e) {
            console.log(e)
        }
    },[]);

    // Create screen for winners and losers
    if (gameOver.guessWord) {
        return (
            <Popup trigger={<button> Trigger</button>} defaultOpen="true" position="center center">
                <div className="gameOver">
                    <h2>It's a <b>{gender}</b>!</h2>
                    <h2>The baby's name is:</h2>
                    <h1>{correctWord}</h1>
                    {gameOver.guessWord && (<h2> You guessed in {currAttempt.attempt} attempt{currAttempt.attempt !== 1 && "s"}</h2>)}
                    <Confetti width={width} height={height} colors={color}/>
                </div>
            </Popup>
        )
    }
    else{
        return(
            <div className="gameOver">
                <h2>Don't worry, we won't tell the baby you lost :)</h2>
                <h2>The baby's name is:</h2>
                <h1>{correctWord}</h1>
            </div>
        )
    }
}

export default GameOver