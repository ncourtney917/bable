import '../App.css';
import Board from "../components/Board";
import Keyboard from '../components/Keyboard';
import GameOver from '../components/GameOver';
import { createContext, useState, useEffect } from 'react';
import {Words, generateNameList} from '../components/Words';
import {useParams} from 'react-router-dom';
import {key} from "../App";
import axios from 'axios';
import Popup from 'reactjs-popup';

var CryptoJS = require("crypto-js");

// User input to enter the word to be guessed
export const AppContext = createContext();

function Game() {
    const { gameId } = useParams();
    const [isLoading, setLoading] = useState("loading");
    const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });
    const [correctWord, setWord] = useState()
    const [parents, setParents] = useState()
    const [letterCount, setCount] = useState(0)
    const [board, setBoard] = useState(Words(5));
    const [disabledLetters, setDisabledLetters] = useState([]);
    const [almostLetters, setAlmostLetters] = useState([]);
    const [correctLetters, setCorrectLetters] = useState([]);
    const [gameOver, setGameOver] = useState({ gameOver: false, guessWord: false })
    const [nameList, setNameList] = useState(new Set());

    useEffect(() => {
        generateNameList().then((names) => {
            setNameList(names.nameSet);
        });
      }, []);
    
    const checkName = (name) => {
        // Capitalize name
        const lower = name.toLowerCase();
        const upper = name.charAt(0).toUpperCase();
        const capitalizedName = upper + lower.slice(1);
        const validName = nameList.has(capitalizedName);
        return (validName);
    }
    // useEffect(()=>{
    //     // Lookup the name that corresponds with the gameID passed in the URL
    //     // gameId and names are stored in MongoDB, accessed from custom API
    //     axios.get('/api/read',{params: {"gameId":gameId}}).then(response => {
    //         console.log(response)
    //         setLoading("success")
    //         console.log("success")
    //         setWord(response.name);
    //         setCount(response.name.length);
    //     })
    //     .catch((e) => {
    //         setLoading("failure")
    //         console.log("failure")
    //         axios.get('api/',{params: {"gameId":gameId}}).then(response => {
    //             console.log('base api')
    //             console.log(response)
    //         })
    //     });
    // },[]);


    // //Decrpyt gameId
    useEffect(()=>{
        var originalGameId = gameId.replace(/gobills/g, '+' ).replace(/joshallen/g, '/').replace(/babble/g, '=');
        var bytes = CryptoJS.AES.decrypt(originalGameId, key);
        try {
            var decodedName = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            var babyVars = decodedName.split(".")
            var name = babyVars[0];
            var parents = babyVars[1];
            setWord(name);
            setParents(parents);
            setCount(name.length);
            setLoading("success")
        }catch(e) {
            setLoading("failure")
            console.log(e)
        }
    },[]);
 
    // Return loading screen until API response
    if (isLoading === "loading") {
        return <div className="App loading-text">Loading Babble game...</div>;
    } else if (isLoading === "failure") {
        return <div className="App loading-text">This game link is not valid. Please check the URL and try again.</div>;
    }

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
                <img alt="baby" src={require('../images/baby_white.png')} />
                <h1>Babble</h1>
            </nav>
            <AppContext.Provider value={{ board, setBoard, currAttempt, setCurrAttempt, onDelete, onEnter, onSelectLetter, correctWord, disabledLetters, setDisabledLetters, correctLetters, setCorrectLetters, almostLetters, setAlmostLetters, gameOver, setGameOver, letterCount }}>
                <div className="game">
                    <h3>Proud Parents:<br></br> {parents}</h3>
                    <h3>Guess our baby's name!</h3>
                    <Board />
                    <Keyboard />
                    {gameOver.gameOver ? <GameOver /> : <div/>} 
                </div>
            </AppContext.Provider>
        </div>
    );
}

export default Game;
