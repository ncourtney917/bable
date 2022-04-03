import React, { useContext, useEffect } from "react";
import { AppContext } from "../App";

function Letter({ letterPos, attemptVal }) {
    const { board, correctWord, currAttempt, setDisabledLetters, letterCount } = useContext(AppContext);
    const letter = board[attemptVal][letterPos];
    const guess = board[attemptVal].slice(0, correctWord.length)
    var correct, almost = false

    if (letter !== "") {
        if (correctWord[letterPos] === letter) {
            // Is letter "correct" (Right letter in right spot)
            correct = true
        } else {
            // Is letter "almost" correct (Right letter, wrong spot)
            // Should NOT be "almost" if this letter is 'correct' somewhere else in the word
            // Should only be "almost" if this is the first instance (furthest to left) of letter not in correct spot

            // correctRemaining is the correctWord, with correctLetters removed
            // guessRemaining is the guessWord with correctLetters replaced with "-"
            var correctRemaining = ""
            var guessRemaining = guess

            // Find letters that were already correctly guessed (correctLetters)
            for (var i = 0; i < letterCount; i++) {
                if (correctWord[i] !== guess[i]) {
                    correctRemaining = correctRemaining + correctWord[i];
                } else {
                    guessRemaining[i] = "-"
                };
            }

            // Remove letters to the left of the current letter that are in correctWord in a different position
            var prevLetters = guessRemaining.slice(0, letterPos);
            for (var j = 0; j < prevLetters.length; j++) {
                correctRemaining = correctRemaining.replace(prevLetters[j], '');
            }

            // Is letter in the remaining letters of the correctWord?
            almost = correctRemaining.includes(letter)
        };
    };

    const letterState = currAttempt.attempt > attemptVal &&
        (correct ? "correct" : almost ? "almost" : "error");

    useEffect(() => {
        if (letter !== "" && !correct && !almost) {
            setDisabledLetters((prev) => [...prev, letter]);
        }
    }, [currAttempt.attempt]);
    return (<div className="letter" id={letterState}> {letter}</div>);
}

export default Letter;