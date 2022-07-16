import '../App.css';
import Board from "../components/Board";
import Keyboard from '../components/Keyboard';
import GameOver from '../components/GameOver';
import { createContext, useState, useEffect } from 'react';
import Words from '../components/Words';
import {useParams} from 'react-router-dom';
import {key} from "../App";
import axios from 'axios';

var CryptoJS = require("crypto-js");

// User input to enter the word to be guessed
export const AppContext = createContext();

function Game() {
    const { gameId } = useParams();
    const [isLoading, setLoading] = useState("loading");
    const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });
    const [correctWord, setWord] = useState()
    const [letterCount, setCount] = useState(0)
    const [board, setBoard] = useState(Words(5));
    const [disabledLetters, setDisabledLetters] = useState([]);
    const [gameOver, setGameOver] = useState({ gameOver: false, guessWord: false })

    useEffect(()=>{
        // Lookup the name that corresponds with the gameID passed in the URL
        // gameId and names are stored in MongoDB, accessed from custom API
        axios.get('api/read',{params: {"gameId":gameId}}).then(response => {
            console.log(response)
            setLoading("success")
            console.log("success")
            setWord(response.name);
            setCount(response.name.length);
        })
        .catch((e) => {
            setLoading("failure")
            console.log("failure")
            axios.get('api/',{params: {"gameId":gameId}}).then(response => {
                console.log('base api')
                console.log(response)
            })
        });
    },[]);


    // Decrpyt gameId
    // useEffect(()=>{
    //     var originalGameId = gameId.replace(/gobills/g, '+' ).replace(/joshallen/g, '/').replace(/babble/g, '=');
    //     var bytes = CryptoJS.AES.decrypt(originalGameId, key);
    //     try {
    //         var decodedName = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    //         var name = decodedName.slice(0,-1);
    //         setWord(name);
    //         setCount(name.length);
    //         setLoading("success");
    //     }catch(e) {
    //         console.log(e)
    //         setLoading("failure")
    //     }
    // },[]);
 
    // Return loading screen until API response
    if (isLoading === "loading") {
        return <div className="App loading-text">Loading Babble game...</div>;
    } else if (isLoading === "failure") {
        return <div className="App loading-text">This game link is not valid. Please check the URL and try again.</div>;
    }
    /* Set the width of the board based on the number of letters in the game */
    let root = document.documentElement;
    let width = (98 * letterCount).toString();
    root.style.setProperty("--screen-width", width + "px");

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
                <h1>Babble</h1>
                <h3>Guess the baby name!</h3>
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

export default Game;
