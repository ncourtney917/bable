import '../App.css';
import Board from "../components/Board";
import Keyboard from '../components/Keyboard';
import GameOver from '../components/GameOver';
import { createContext, useState, useEffect } from 'react';
import {Words} from '../components/Words';
import {useParams} from 'react-router-dom';

// User input to enter the word to be guessed
export const AppContext = createContext();

function Game() {
    const { gameId } = useParams();
    const [isLoading, setLoading] = useState("loading");
    const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });
    const [correctWord, setWord] = useState()
    const [parents, setParents] = useState()
    const [gender, setGender] = useState()
    const [background, setBackground] = useState()
    const [letterCount, setCount] = useState(0)
    const [board, setBoard] = useState(Words(5));
    const [disabledLetters, setDisabledLetters] = useState([]);
    const [almostLetters, setAlmostLetters] = useState([]);
    const [correctLetters, setCorrectLetters] = useState([]);
    const [gameOver, setGameOver] = useState({ gameOver: false, guessWord: false })
    const [leaderboard, setLeaderboard] = useState([]);

    
    const getGameDetails = async(id) => {
        const endpoint = `/data-api/rest/Game/Id`;
        const response = await fetch(`${endpoint}/${id}`);
        const result = await response.json();
        return result.value;
    }

    // Get game details based on the ID
    useEffect(()=>{
        getGameDetails(gameId).then((data) => {
            if (data) {
                try {
                    var name = data[0].Name;
                    var parents = data[0].Parents;
                    var gender = data[0].Gender;
                    var background = data[0].Background;
                    setWord(name);
                    setParents(parents);
                    setGender(gender);
                    setBackground(background);
                    setCount(name.length);
                    setLoading("success")
                }catch(e) {
                    setLoading("failure")
                    console.log(e)
                }
            }
            else {
                console.log("Error in getting game details")
            }
        });       
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
            <AppContext.Provider value={{ board, setBoard, currAttempt, setCurrAttempt, onDelete, onEnter, onSelectLetter, correctWord, disabledLetters, setDisabledLetters, correctLetters, setCorrectLetters, almostLetters, setAlmostLetters, gameOver, setGameOver, letterCount, gender, leaderboard, setLeaderboard }}>
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
