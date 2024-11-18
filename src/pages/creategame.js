import React from "react";
import {key} from "../App";


class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '' , gender: '', access_code:'', access:false, parents:''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeGenderRadio = this.onChangeGenderRadio.bind(this);
        this.handleAccessChange = this.handleAccessChange.bind(this);
        this.handleAccessSubmit = this.handleAccessSubmit.bind(this);
        this.handleParentChange = this.handleParentChange.bind(this);
        this.handleBackendChange = this.handleBackendChange.bind(this);
        this.onChangeColorRadio = this.onChangeColorRadio.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleParentChange(event) {
        this.setState({ parents: event.target.value });
    }

    handleBackendChange(event) {
        this.setState({ backend: event.target.value });
    }
    

    handleAccessChange(event) {
        this.setState({ access_code: event.target.value });
    }


    async createGameDetails(data) {      
        const endpoint = `/data-api/rest/Game/`;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        const result = await response.json();
    }

    async handleSubmit(event) {
        event.preventDefault();
        var formOutput = document.getElementById('formOutput')
        formOutput.innerHTML = "Game created for: " + this.state.value
        const babyName = this.state.value.toUpperCase()
        const gender = this.state.gender
        const parents = this.state.parents
        const gameId = this.state.backend
        const color = this.state.color
        var accessCode = document.getElementById('accessCode')
        var newGameLink = document.getElementById('newGameLink')
        const game_info = {
            Id: gameId,
            Name: babyName,
            Gender: gender,
            Parents: parents,
            Background: color
        }
        this.createGameDetails(game_info)

        newGameLink.setAttribute("href", "/game/" + gameId)
        accessCode.innerHTML = "Link to the new game:"
        newGameLink.innerHTML = "https://www.babblepuzzle/game/" + gameId
    }

    async handleAccessSubmit(event) {
        event.preventDefault();
        var formOutput = document.getElementById('formOutput')
        if (this.state.access_code === "letsgobills") {
            this.setState({ access: true});
            formOutput.innerHTML = ""
        }else {
            this.setState({ access: false});
            formOutput.innerHTML = "Incorrect access code"
        }
    }

    onChangeGenderRadio(event) {
        this.setState({ gender: event.target.value });
    }

    onChangeColorRadio(event) {
        this.setState({ color: event.target.value });
    }

    render() {
        if (this.state.access === false) {
            return (
                <form className="form" onSubmit={this.handleAccessSubmit}>
                    <h3>Please enter your access code to create a new game</h3>
                    <input type="text" value={this.state.access_code} onChange={this.handleAccessChange} />
                    <input className="submit" type="submit" value="Submit" />

                </form>
            )}
        else{
            return (
                <form className="form" onSubmit={this.handleSubmit}>
                    <h2>Mommy Mode</h2>
                    <h3>Create a name for your friends to guess</h3>
                    <label>
                        Enter a baby name:  
                    </label>
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                    <br></br>
                    <br></br>
                    <label>
                        Gender:  
                    </label>
                    <div onChange={this.onChangeGenderRadio}>
                        <input type="radio" value="Boy" name="gender" /> Boy
                        <input type="radio" value="Girl" name="gender" /> Girl
                    </div>
                    <br></br>
                    <label>
                        Enter the parents' names<br></br> (e.g. John and Jane Doe):  
                    </label>
                    <input type="text" value={this.state.parents} onChange={this.handleParentChange} />
                    <br></br>
                    <br></br>
                    <label>
                        Enter the backend of the url<br></br> (e.g. smith-baby-name):
                    </label>
                    <input type="text" value={this.state.backend} onChange={this.handleBackendChange} />
                    <br></br>
                    <br></br>
                    <label>
                        Background Color:  
                    </label>
                    <div onChange={this.onChangeColorRadio}>
                        <input type="radio" value="blue" name="color" /> Blue
                        <input type="radio" value="pink" name="color" /> Pink
                        <input type="radio" value="dark" name="color" /> Dark
                        <input type="radio" value="light" name="color" /> Light
                    </div>

                    <input className="submit" type="submit" value="Submit" />
                </form>
            );
        }
    }
}


const CreateGame = () => {
    return (
        <div className="App">
            <nav>
                <img alt="baby" src={require('../images/baby_white.png')} />
                <h1>Babble</h1>
            </nav>
            <NameForm />
            <h3 id="formOutput"></h3>
            <h3 id="accessCode"></h3>
            <a id="newGameLink" className="hyperLink"></a>
        </div>
    );
};

export default CreateGame;