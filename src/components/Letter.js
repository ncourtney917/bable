import React, { useContext, useEffect } from "react";
import { AppContext } from "../App";

function Letter({ letterPos, attemptVal }) {
    const { board, correctWord, currAttempt, setDisabledLetters, letterCount } = useContext(AppContext);
    const letter = board[attemptVal][letterPos];
    const guess = board[attemptVal].slice(0, correctWord.length)

    // Right letter in right spot
    const correct = correctWord[letterPos] === letter

    // Check if letter is 'almost' correct => Right letter, wrong spot
    // Should only be 'almost' if this is the first instance (furthest to left) of letter
    // Should NOT be 'almost' if this letter is 'correct' somewhere else in the word
    var remainingLetters = ""
    if (letter !== "") {
        // Remove correctly guessed letters from correctWord
        for (var i = 0; i < letterCount; i++) {
            if (correctWord[i] !== guess[i]) {
                remainingLetters = remainingLetters + correctWord[i];
            }
        }
        // Remove letters to the left of the current letter that are in correctWord
        var prevLetters = guess.slice(0, letterPos);
        var re = new RegExp(`[${prevLetters}]`, "g");
        // FOUND BUG HERE WHEN GUESSING WORD NNNNNICHOLAS. REPLACE WILL REPLACE ALL THE INSTANCES OF N, NOT JUST 1.
        //TODO 
        remainingLetters = remainingLetters.replace(re, '');
    };
    // Right letter in wrong spot
    const almost = !correct && remainingLetters.includes(letter)
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