import React, { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../pages/playgame';
import Confetti from 'react-confetti';
import {useParams} from 'react-router-dom';
import Popup from 'reactjs-popup';
import Leaderboard from './Leaderboard';


function GameOver() {
    const { gameOver, setGameOver, correctWord, currAttempt, gender, leaderboard, setLeaderboard, getLeaderboard } = useContext(AppContext);
    const { gameId } = useParams();
    const [color, setColor] = useState(['#f44336','#e91e63','#9c27b0','#673ab7','#3f51b5','#2196f3','#03a9f4','#FF5722','#795548']	)
    const height = window.innerHeight + 150
    const width = window.innerWidth
    const [playerName, setPlayerName] = useState('')
    const submitButtonRef = useRef(null);
    var guesses = 0;
    const [isOpen, setIsOpen] = useState(true);
    const [scoreSubmitted, setScoreSubmitted] = useState()



    const handleNameChange = (event) => {
        setPlayerName(event.target.value);
    } 

    const handleSaveName = async(event) => {
        event.preventDefault();
        if (playerName !== ''){
            if (gameOver.guessWord === false){
                guesses = "X"
            } else {
                guesses = currAttempt.attempt
            }
            var data = {
                GameId: gameId,
                Guesses: guesses,
                Won: gameOver.guessWord,
                PlayerName: playerName
            }
            const endpoint = `/data-api/rest/GameLeaderboard/`;
            try {
                const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
                });

                if (response.ok) {
                    const result = await response.json();
                    setScoreSubmitted("submitted");
                    const sortedData = await getLeaderboard(gameId);
                    setLeaderboard(sortedData);
                } else if (response.status === 409) {
                    // Handle 409 Conflict specifically
                    console.error("Conflict: A score has already been submitted for this name on the leaderboard.");
                    alert("Error: A score has already been submitted for this name on the leaderboard. Please modify the name to make it unique.");

                }else {
                    // Handle other errors
                    console.error(`Error: ${response.status} - ${response.statusText}`);
                    alert("An unexpected error occured. Please try again later.");
                }
            
            }catch (error) {
                // Handle network or other unexpected errors
                console.error("Network error or unexpected issue:", error);
                alert("An unexpected error occured. Please try again later.");
            }
    }

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleOpen = () => {
        setIsOpen(true);
    };

    useEffect(() => {
      if (submitButtonRef.current) {
        submitButtonRef.current.focus();
      }
    }, []);

    // Set confetti color based on gender
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
                <Popup 
                    open={isOpen}
                    position="top center"
                    arrow={false}
                    modal={true}
                    closeOnDocumentClick={false}
                    closeOnEscape={false}
                    onClose={handleClose}
                >
                    {(close) => (
                        <div className="gameOver popup">
                            <button onClick={close} className="close-button" style={{color: "#ffffff"}}>
                                &times;
                            </button>
                            <h1>It's a {gender}!</h1>
                            <hr></hr>
                            <div className="popup-body">
                                <h3>The baby's name is:</h3>
                                <h1>{correctWord}</h1>
                                {gameOver.guessWord && (<h3 className="margin-top"> You guessed it correcly in {currAttempt.attempt} attempt{currAttempt.attempt !== 1 && "s"}</h3>)}
                                <hr></hr>
                                <div>
                                    {
                                        scoreSubmitted === "submitted" ? (
                                            <p>Score submitted. Thanks for playing!</p>
                                        ) : scoreSubmitted === "N/A" ? (
                                            <p>Score previously submitted. You cannot submit multiple scores from this device.</p>
                                        ) : (                                    
                                                <div>
                                                    <label>
                                                        Enter you name to save your score to the leaderboard!  
                                                    </label>
                                                    <form className='leaderboard-submit' onSubmit={handleSaveName}>
                                                        <input 
                                                            style={{margin: '15px', width: '50%'}}
                                                            type="text" value={playerName}
                                                            onChange={handleNameChange}
                                                        />
                                                        <input ref={submitButtonRef} className="submit" type="submit" value="Save"/>
                                                    </form>
                                                </div>
                                        ) 
                                    }
                                </div>
                                <Leaderboard />
                                <p className="info-text">Created by Nick Courtney</p>
                            </div>
                        </div>
                    )}
                </Popup>
                <Confetti width={width} height={height} colors={color}/>
                <button onClick={handleOpen} className="results-button submit">
                    See results
                </button>
            </div>
        )
    }
    else{
        return (
            <div>
                <Popup 
                    trigger={<button className="results-button submit">See results</button>}
                    defaultOpen={true}
                    position="top center"
                    arrow={false}
                    modal={true}
                    closeOnDocumentClick={false}
                    closeOnEscape={false}
                >
                    {(close) => (
                        <div className="gameOver popup">
                            <button onClick={close} className="close-button" style={{color: "#ffffff"}}>
                                &times;
                            </button>
                            <h1>It's a {gender}!</h1>
                            <hr></hr>
                            <div className="popup-body">
                                <h3>The baby's name is:</h3>
                                <h1>{correctWord}</h1>
                                <h3 className="margin-top">Don't worry, we won't tell the baby you lost :)</h3>
                            </div>
                            <hr></hr>
                            <div>
                                {scoreSubmitted === "pending"  ? (
                                    <div>
                                        <label>
                                            Enter you name to save your score to the leaderboard!  
                                        </label>
                                        <form className='leaderboard-submit' onSubmit={handleSaveName}>
                                            <input 
                                                style={{margin: '15px', width: '50%'}}
                                                type="text" value={playerName}
                                                onChange={handleNameChange}
                                            />
                                            <input ref={submitButtonRef} className="submit" type="submit" value="Save"/>
                                        </form>
                                    </div>
                                ) : scoreSubmitted === "submitted" ? (
                                    <p>Score submitted. Thanks for playing!</p>
                                ) : scoreSubmitted === "N/A" ? (
                                    <p>Score previously submitted. You cannot submit multiple scores from this device.</p>
                                ) : (
                                    <p>Thanks for playing!</p>
                                )}
                            </div>
                            <Leaderboard />
                            <p className="info-text">Created by Nick Courtney</p>
                        </div>
                    )}
                </Popup>
                <Confetti width={width} height={height} colors={color}/>
            </div>
        )
    }
}


export default GameOver