
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; // Your renamed original App.jsx
import Profile from './Profile';
import FAQ from './FAQ';
import Gallery from './Gallery';
import Login from './Login';
import SignUp from './SignUp';
import Navbar from './Navbar'

const App = () => {
  return (
    <Router>
      <Navbar /> 
      <div className="pt-20"> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path="/profile/:id?" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;