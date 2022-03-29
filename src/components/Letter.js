import React, { useContext, useEffect } from "react";
import { AppContext } from "../App";

function Letter({ letterPos, attemptVal }) {
    const { board, correctWord, currAttempt, setDisabledLetters } = useContext(AppContext);
    const letter = board[attemptVal][letterPos];
    const guess = board[attemptVal].slice(0, correctWord.length)

    // Right letter in right spot
    const correct = correctWord[letterPos] === letter

    // Remove correctly guessed letters from correctWord
    var remainingLetters = ""
    for (var i = 0; i < correctWord.length; i++) {
        if (correctWord[i] !== guess[i]) {
            remainingLetters = remainingLetters + correctWord[i];
        }
    }
    // Remove letters to the left of the current letter that are in correctWord
    var prevLetters = guess.slice(0, letterPos);
    var re = new RegExp(`[${prevLetters}]`, "g");
    var almostSearch = remainingLetters.replace(re, '');

    // Right letter in wrong spot
    const almost = !correct && letter !== "" && almostSearch.includes(letter)
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