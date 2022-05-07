import React from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
    return (
        <div className="App">
            <nav>
                <h1>Babble</h1>
                <h4>Wordle for Baby Names!</h4>
            </nav>
            <h3>Select a mode:</h3>
            <NavLink to="/create" activeStyle>
                Mommy Mode: Create a baby name for your friends to guess!
            </NavLink>
            <br></br>
            <NavLink to="/" activeStyle>
                Babysitter Mode: Guess a friend's baby name!
            </NavLink>
        </div>
    );
};

export default Home;