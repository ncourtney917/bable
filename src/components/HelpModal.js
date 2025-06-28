import React from 'react';
import Popup from 'reactjs-popup';
import '../App.css';

function HelpModal({ isOpen, onClose }) {
    return (
        <Popup 
            open={isOpen}
            position="center center"
            arrow={false}
            modal={true}
            closeOnDocumentClick={true}
            closeOnEscape={true}
            onClose={onClose}
        >
            {(close) => (
                <div className="help-modal popup">
                    <button onClick={close} className="close-button" style={{color: "#ffffff"}}>
                        &times;
                    </button>
                    <div className="popup-body">
                        <h1>How to Play Babble</h1>
                        <hr></hr>
                        
                        <div className="help-content">
                            <p className="help-intro">
                                <strong>Babble is like Wordle, but for baby names!</strong>
                            </p>
                            
                            <p>
                                Guess the baby's name by submitting names that match the length shown on screen. 
                                You have 6 attempts to figure out the correct name.
                            </p>
                            
                            <h3>Understanding the Colors</h3>
                            <p>After each guess, the letters will change color to give you clues:</p>
                            
                            <div className="color-examples">
                                <div className="example-row">
                                    <div className="letter-example" id="correct">A</div>
                                    <span className="example-text">
                                        <strong>Green</strong> - The letter A is in the correct position
                                    </span>
                                </div>
                                
                                <div className="example-row">
                                    <div className="letter-example" id="almost">B</div>
                                    <span className="example-text">
                                        <strong>Yellow</strong> - The letter B is in the name but in the wrong position
                                    </span>
                                </div>
                                
                                <div className="example-row">
                                    <div className="letter-example" style={{backgroundColor: 'var(--board-color)'}}>C</div>
                                    <span className="example-text">
                                        <strong>Gray</strong> - The letter C is not in the name at all
                                    </span>
                                </div>
                            </div>
                            
                            <h3>Example</h3>
                            <p>If the baby's name is "THEO" and you guess "TONY":</p>
                            <div className="example-guess">
                                <div className="letter-example" id="correct">T</div>
                                <div className="letter-example" id="almost">O</div>
                                <div className="letter-example" style={{backgroundColor: 'var(--board-color)'}}>N</div>
                                <div className="letter-example" style={{backgroundColor: 'var(--board-color)'}}>Y</div>
                            </div>
                            <p className="example-explanation">
                                • T is green (correct letter in correct position)<br/>
                                • O is yellow (in the name but wrong position)<br/>
                                • N is gray (not in the name)<br/>
                                • Y is green (not in the name)
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </Popup>
    );
}

export default HelpModal; 