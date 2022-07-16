import React from 'react';
import './App.css';
//import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route }
  from 'react-router-dom';
import Game from './pages/playgame';
import CreateGame from './pages/creategame';

function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route exact path='/game/:gameId' element={<Game />} />
        <Route path='/' element={<CreateGame />} />
      </Routes>
    </Router>
    <footer>Created by Nick Courtney</footer>
    </div>
  );
}

export default App;
export const key = 'LetsGoBills';