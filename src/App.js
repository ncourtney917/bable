import React from 'react';
import './App.css';
//import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route }
  from 'react-router-dom';
import Home from './pages/home';
import Game from './pages/playgame';
import CreateGame from './pages/creategame';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/create' element={<CreateGame />} />
        <Route path='/game' element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;