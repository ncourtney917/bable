import React from 'react';
import './App.css';
//import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route }
  from 'react-router-dom';
import Game from './pages/playgame';
import CreateGame from './pages/creategame';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/game/:gameId' element={<Game />} />
        <Route path='/create' element={<CreateGame />} />
      </Routes>
    </Router>
  );
}

export default App;
export const key = 'LetsGoBills';