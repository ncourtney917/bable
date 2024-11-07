import React from "react";
import {key} from "../App";

var CryptoJS = require("crypto-js");

class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '' , gender: '', access_code:'', access:false, parents:''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeRadio = this.onChangeRadio.bind(this);
        this.handleAccessChange = this.handleAccessChange.bind(this);
        this.handleAccessSubmit = this.handleAccessSubmit.bind(this);
        this.handleParentChange = this.handleParentChange.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleParentChange(event) {
        this.setState({ parents: event.target.value });
    }

    handleAccessChange(event) {
        this.setState({ access_code: event.target.value });
    }

    generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }


    async create(data) {
        const gql = `
            mutation create($item: CreateGameInput!) {
            createGame(item: $item) {
                id
                name
                gender
                parents
                color_id
                url
            }
        }`;
    
        const query = {
            query: gql,
            variables: {
            item: data
            } 
        };
        
        const endpoint = "data-api/graphql";
        const result = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(query)
        });

        const response = await result.json();
        console.table(response.data.createGame);
    }

    async handleSubmit(event) {
        event.preventDefault();
        var formOutput = document.getElementById('formOutput')
        formOutput.innerHTML = "Game created for: " + this.state.value
        const babyName = this.state.value.toUpperCase()
        const gender = this.state.gender.slice(0,1)
        const parents = this.state.parents
        var accessCode = document.getElementById('accessCode')
        // Encrypt gameId and replace special characters
        var babyString = `${babyName}.${parents}.${gender}`;
        var gameIdStr = CryptoJS.AES.encrypt(JSON.stringify(babyString), key).toString();
        const gameId = gameIdStr.replace(/\+/g,'gobills').replace(/\//g,'joshallen').replace(/=/g,'babble');
        var newGameLink = document.getElementById('newGameLink')
        const data = {
            id: this.generateRandomString(10),
            name: babyName,
            gender: gender,
            parents: parents,
            color_id: '1',
            url: 'test'
        }
        this.create(data)

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

    onChangeRadio(event) {
        this.setState({ gender: event.target.value });
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
                    <label className="spacing">
                        Gender:  
                    </label>
                    <div onChange={this.onChangeRadio}>
                        <input type="radio" value="Male" name="gender" /> Male
                        <input type="radio" value="Female" name="gender" /> Female
                    </div>
                    <br></br>
                    <label>
                        Enter the parents' names<br></br> (eg. John and Jane Doe):  
                    </label>
                    <input type="text" value={this.state.parents} onChange={this.handleParentChange} />
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