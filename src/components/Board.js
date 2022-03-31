import React, { useContext } from 'react';
import { AppContext } from '../App';
import Letter from './Letter';

function Board() {
    const { letterCount } = useContext(AppContext);
    const data = Array.from(Array(letterCount).keys());
    return (
        <div className="board">
            {" "}
            <div className="row">
                {data.map(i => <Letter letterPos={i} attemptVal={0} />)}
            </div>
            <div className="row">
                {data.map(i => <Letter letterPos={i} attemptVal={1} />)}
            </div>
            <div className="row">
                {data.map(i => <Letter letterPos={i} attemptVal={2} />)}
            </div>
            <div className="row">
                {data.map(i => <Letter letterPos={i} attemptVal={3} />)}
            </div>
            <div className="row">
                {data.map(i => <Letter letterPos={i} attemptVal={4} />)}
            </div>
            <div className="row">
                {data.map(i => <Letter letterPos={i} attemptVal={5} />)}
            </div>
        </div>
    );
}

export default Board;