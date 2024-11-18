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
    const [letterCount, setCount] = useState(0)
    const [board, setBoard] = useState(Words(5));
    const [disabledLetters, setDisabledLetters] = useState([]);
    const [almostLetters, setAlmostLetters] = useState([]);
    const [correctLetters, setCorrectLetters] = useState([]);
    const [gameOver, setGameOver] = useState({ gameOver: false, guessWord: false, showLeaderboard: false })
    const [leaderboard, setLeaderboard] = useState([]);
    const [theme, setTheme] = useState(['light']);

    
    const getGameDetails = async(id) => {
        const endpoint = `/data-api/rest/Game/Id`;
        const response = await fetch(`${endpoint}/${id}`);
        const result = await response.json();
        return result.value;
    }

    const getLeaderboard = async(id) => {
        const endpoint = `/data-api/rest/GameLeaderboard`;
        const response = await fetch(`${endpoint}`);
        const result = await response.json();
        const filteredData = result.value.filter(score => score.GameId === id);

        // Replace all 0s with 'x' in the filtered data
        const updatedData = filteredData.map(score => {
            const updatedScore = { ...score }; // Create a shallow copy to avoid mutation
            
            // Replace 0s with Xs
            updatedScore.Guesses = updatedScore.Guesses.toString().replaceAll("0", "X");

            return updatedScore;
        });

        return updatedData.sort((a, b) => a.Guesses.localeCompare(b.Guesses));
    }

    const themes = {
        blue: {
            '--primary-color': '#cce7ff',
            '--secondary-color': '#0067ac',
            '--tertiary-color': '#6dc2fb',
            '--popup-text-color': '#ffffff',
            '--button-alt-background': '#b8c7c9',
            '--leaderboard-color': '#b8c7c9',
            '--leaderboard-header-color': '#fffcc3'
        },
        pink: {
            '--primary-color': '#cce7ff',
            '--secondary-color': '#0067ac',
            '--tertiary-color': '#6dc2fb',
            '--popup-text-color': '#ffffff',
            '--button-alt-background': '#b8c7c9',
            '--leaderboard-color': '#b8c7c9',
            '--leaderboard-header-color': '#fffcc3'
        },
        dark: {
            '--primary-color': '#cce7ff',
            '--secondary-color': '#0067ac',
            '--tertiary-color': '#6dc2fb',
            '--popup-text-color': '#ffffff',
            '--button-alt-background': '#b8c7c9',
            '--leaderboard-color': '#b8c7c9',
            '--leaderboard-header-color': '#fffcc3'
        },
        light: {
            '--primary-color': '#cce7ff',
            '--secondary-color': '#0067ac',
            '--tertiary-color': '#6dc2fb',
            '--popup-text-color': '#ffffff',
            '--button-alt-background': '#b8c7c9',
            '--leaderboard-color': '#b8c7c9',
            '--leaderboard-header-color': '#fffcc3'
        }
      };

    const applyTheme = (themeName) => {
        const theme = themes[themeName];
        if (theme) {
          Object.entries(theme).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
          });
        }
      };

    // Get game details based on the ID
    useEffect(()=>{
        getGameDetails(gameId).then((data) => {
            if (data) {
                try {
                    var name = data[0].Name;
                    var parents = data[0].Parents;
                    var gender = data[0].Gender;
                    setWord(name);
                    setParents(parents);
                    setGender(gender);
                    setTheme(data[0].Background);
                    applyTheme(data[0].Background)
                    setCount(name.length);
                    setLoading("success");
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
 

    useEffect(() => {
        const fetchData = async () => {
          const sortedData = await getLeaderboard(gameId);
          setLeaderboard(sortedData);
        };
    
        fetchData();
      }, [gameId]);

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
            setGameOver({ gameOver: true, guessWord: true, showLeaderboard: true })
            return;
        }

        if (currAttempt.attempt === 5) {
            setGameOver({ gameOver: true, guessWord: false, showLeaderboard: true })
            return;
        }
    };


    return (
        <div className='App'>
            <nav>
                <img alt="baby" src={require('../images/baby_white.png')} />
                <h1>Babble</h1>
            </nav>
            <AppContext.Provider value={{ board, setBoard, currAttempt, setCurrAttempt, onDelete, onEnter, onSelectLetter, correctWord, disabledLetters, setDisabledLetters, correctLetters, setCorrectLetters, almostLetters, setAlmostLetters, gameOver, setGameOver, letterCount, gender, leaderboard, setLeaderboard, getLeaderboard, theme }}>
                <div className="game">
                    <h3>Guess our baby's name!<br></br> - {parents}</h3>
                    <Board />
                    <Keyboard />
                    {gameOver.gameOver ? <GameOver /> : <div/>} 
                </div>
            </AppContext.Provider>
        </div>
    );
}

export default Game;
