import React, { useContext } from 'react';
import { AppContext } from "../App";

function Key({ keyVal, bigKey, disabled }) {
    const { onDelete, onEnter, onSelectLetter, letterCount } = useContext(AppContext);
    const selectLetter = () => {
        if (keyVal === "ENTER") {
            onEnter(letterCount)
        }
        else if (keyVal === "DELETE") {
            onDelete()
        }
        else {
            onSelectLetter(keyVal, letterCount)
        }
    };
    return (
        <div className="key" id={bigKey ? "big" : disabled && "disabled"} onClick={selectLetter}>
            {keyVal}
        </div>
    )
}

export default Key;