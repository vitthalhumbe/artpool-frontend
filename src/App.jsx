// src/App.jsx (Your main routing file)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; // Your renamed original App.jsx
import Profile from './Profile';
import FAQ from './FAQ';
import Login from './Login';
import SignUp from './SignUp';
import Navbar from './Navbar'

const App = () => {
  return (
    <Router>
      {/* 1. Navbar sits outside Routes so it never reloads */}
      <Navbar /> 
      
      {/* 2. Padding top ensures content isn't hidden behind fixed Navbar */}
      <div className="pt-20"> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;