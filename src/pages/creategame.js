import React, { useState } from "react";

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

    handleSubmit(event) {
        event.preventDefault();
        var formOutput = document.getElementById('formOutput')
        formOutput.innerHTML = "Game created for: " + this.state.value
        var accessCode = document.getElementById('accessCode')
        const code = Math.random().toString(36).substring(2, 10);
        accessCode.innerHTML = "Your game is accessible with this access code: " + code
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
        </div>
    );
};

export default Create;