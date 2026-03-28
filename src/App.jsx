
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; // Your renamed original App.jsx
import Profile from './Profile';
import FAQ from './FAQ';
import Gallery from './Gallery';
import Login from './Login';
import SignUp from './SignUp';
import Navbar from './Navbar'
import Messages from './Messages';
// inside Routes:
import Artists from './Artists';
// inside Routes:
import ResetPassword from './ResetPassword';
import ForgotPassword from './ForgotPassword';
import NotFound from './NotFound';
// at the bottom of Routes, after all other routes:
// inside Routes:

import Commission from './Commission';
import About from './About';

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
          <Route path='/messages' element={<Messages />} />
          <Route path='/artists' element={<Artists />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />

          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/commission' element={<Commission />} />
          <Route path='/about' element={<About />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;