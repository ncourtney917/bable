import React from "react";
import axios from 'axios';

class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    async handleSubmit(event) {
        event.preventDefault();
        var formOutput = document.getElementById('formOutput')
        formOutput.innerHTML = "Game created for: " + this.state.value
        const babyName = this.state.value.toUpperCase()
        var accessCode = document.getElementById('accessCode')
        const gameId = Math.random().toString(36).substring(2, 15);
        var newGameLink = document.getElementById('newGameLink')

        newGameLink.setAttribute("href", "/game/" + gameId)
        accessCode.innerHTML = "Link to the new game:"
        newGameLink.innerHTML = "https://www.babblepuzzle/game/" + gameId

        const response = await axios.post(
            'https://data.mongodb-api.com/app/data-loapv/endpoint/data/v1/action/insertOne',
            {"collection":"gameentries",
            "database":"babblegames",
            "dataSource":"gamelog",
            "document": {"gameId": gameId, "name":babyName}},
            { headers: { 'Content-Type': 'application/json',
                         'api-key': '62ccb116d694a13c4a1fa328'} 
            } 
          )
        console.log(response.data)

        // localStorage.setItem(gameId, this.state.value.toUpperCase());
        // console.log(localStorage)
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
                <input type="submit" value="Submit" />
            </form>
        );
    }
}


const Create = () => {
    return (
        <div className="App">
            <nav>
                <h1>Babble</h1>
            </nav>
            <NameForm />
            <h3 id="formOutput"></h3>
            <h3 id="accessCode"></h3>
            <a id="newGameLink" class="hyperLink"></a>
        </div>
    );
};

export default Create;