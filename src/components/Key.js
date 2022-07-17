import React, { useContext } from 'react';
import { AppContext } from '../pages/playgame';

function Key({ keyVal, bigKey, disabled, correct, almost}) {
    const { onDelete, onEnter, onSelectLetter, letterCount } = useContext(AppContext);
    const selectLetter = () => {
        if (keyVal === "ENTER") {
            onEnter(letterCount)
        }
        else if (keyVal === "DEL") {
            onDelete()
        }
        else {
            onSelectLetter(keyVal, letterCount)
        }
    };
    return (
        <div className="key" id={bigKey ? "big" : correct ? "correct" : almost ? "almost" : disabled ? "disabled" : "regular"} onClick={selectLetter}>
            {keyVal}
        </div>
    )
}

export default Key;