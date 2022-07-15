import React from "react";
import {key} from "../App";

var CryptoJS = require("crypto-js");

class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '' , gender: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeRadio = this.onChangeRadio.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    async handleSubmit(event) {
        event.preventDefault();
        var formOutput = document.getElementById('formOutput')
        formOutput.innerHTML = "Game created for: " + this.state.value
        const babyName = this.state.value.toUpperCase()
        const gender = this.state.gender.slice(0,1)
        var accessCode = document.getElementById('accessCode')
        // Encrypt gameId and replace special characters
        var gameIdStr = CryptoJS.AES.encrypt(JSON.stringify(babyName + gender), key).toString();
        const gameId = gameIdStr.replace(/\+/g,'gobills').replace(/\//g,'joshallen').replace(/=/g,'babble');
        var newGameLink = document.getElementById('newGameLink')

        newGameLink.setAttribute("href", "/game/" + gameId)
        accessCode.innerHTML = "Link to the new game:"
        newGameLink.innerHTML = "https://www.babblepuzzle/game/" + gameId
    }

    onChangeRadio(event) {
        this.setState({ gender: event.target.value });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h2>Mommy Mode</h2>
                <h3>Create a name for your friends to guess</h3>
                <label>
                    Enter a baby name:  
                </label>
                <input type="text" value={this.state.value} onChange={this.handleChange} />
                <br></br>
                <br></br>
                <label className="spacing">
                    Gender:  
                </label>
                <div onChange={this.onChangeRadio}>
                    <input type="radio" value="Male" name="gender" /> Male
                    <input type="radio" value="Female" name="gender" /> Female
                </div>
                      <br></br>
                <input className="submit" type="submit" value="Submit" />
            </form>
        );
    }
}


const Create = () => {
    return (
        <div className="App">
            <nav>
                <h1>Babble</h1>
                <h3>Guess the baby name!</h3>
            </nav>
            <NameForm />
            <h3 id="formOutput"></h3>
            <h3 id="accessCode"></h3>
            <a id="newGameLink" className="hyperLink"></a>
        </div>
    );
};

export default Create;