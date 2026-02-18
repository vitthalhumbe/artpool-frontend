import React from 'react';
import { Search, Star, Menu, X } from 'lucide-react';
import {User} from 'lucide-react';
import HeroImage from "./assets/hero.jpg";
import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';


import Img1 from "./assets/img1.jpg";
import Img2 from "./assets/img2.jpg";
import Img3 from "./assets/img3.jpg";
import Img4 from "./assets/img4.jpg";

import { useNavigate } from 'react-router-dom';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null); 
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100">
      
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold tracking-tight">ArtPool</span>
            </div>



            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Artists</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Gallery</a>

              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Commission</a>
            </div>


            <div className="hidden md:flex items-center space-x-6">
              
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium">
                    Hello, {user.username}
                  </span>
                  
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                     {user.profile?.avatar_url ? (
                        <img src={user.profile.avatar_url} onClick={() => navigate('/profile')} alt="Profile" className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500"><User size={20}/></div>
                     )}
                  </div>

                  <button 
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    title="Log Out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>

              ) : (
                <>
                  <button 
                    onClick={() => navigate('/login')} 
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Log in
                  </button>
                  <button 
                    onClick={() => navigate('/signup')} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors"
                  >
                    Create Account
                  </button>
                </>
              )}

            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}

              </button>
            </div>
          </div>
        </div>
      </nav>



      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Discover, and Buy Original Art <br className="hidden md:block" /> from Independent Artists.
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          Buy original art or hire world-class artists to draw custom pieces for you.
        </p>

        <div className="max-w-2xl mx-auto relative mb-16">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for oil paintings, sketches, artists..." 
              className="w-full pl-12 pr-32 py-4 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-blue-700 text-white px-8 rounded-full font-medium transition-colors">
              Search
            </button>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-50 aspect-[16/8]">
          <img 
            src={HeroImage}
            alt="Art showcase" 
            className="w-full h-full object-cover"
          />
        </div>
      </main>

      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">10,000+</div>
            <div className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Active Users</div>
          </div>
          <div className="md:border-l md:border-r border-gray-100">
            <div className="text-3xl font-bold text-gray-900 mb-1">5,000+</div>
            <div className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Sketches Sold</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">300+</div>
            <div className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Artists</div>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Artworks</h2>
            <p className="text-gray-500">Curated collection of this week's most popular pieces.</p>
          </div>
          <a href="#" className="text-primary font-semibold hover:underline hidden sm:block">View Gallery →</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ArtCard 
            title="Blooming in Dignity" 
            artist="Vitthal Humbe" 
            price="500" 
            image={Img1}
          />
          <ArtCard 
            title="The wise women" 
            artist="Parth Suryawanshi" 
            price="1000" 
            image={Img2}
          />
          <ArtCard 
            title="Duality of Man" 
            artist="Abhijit Achrekar" 
            price="699" 
            image={Img3}
          />
          <ArtCard 
            title="Silent Travel" 
            artist="Yash Gajwani" 
            price="499" 
            image={Img4}
          />
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">What our community says</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Siddhant Salonkhe"
              initial="S"
              quote="I found the suitable artist, who is excited to draw my portrait, and with ease of communication and payments here, On ArtPool"
            />
            <TestimonialCard 
              name="Vedant Swami"
              initial="V"
              quote="As an artist, I find Artpool very helpful platform, which enables to showcase my work and expand my network."
            />
            <TestimonialCard 
              name="Viraj Patil"
              initial="V"
              quote="I was looking for suitable Art piece for my new apartment wall, This platform helps me to find the painting within my budget."
            />
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-200 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="text-xl font-bold mb-4 md:mb-0">ArtPool</div>
        <div className="flex space-x-8 text-sm text-gray-500">
          <a href="#" className="hover:text-gray-900">About</a>
          <a href="#" className="hover:text-gray-900">Privacy</a>
          <a href="#" className="hover:text-gray-900">Terms</a>
          <a href="#" className="hover:text-gray-900">Contact</a>
        </div>
        <div className="text-sm text-gray-400 mt-4 md:mt-0">© 2026 ArtPool Inc. </div>
      </footer>

    </div>
  );
};
const ArtCard = ({ image, title, artist, price }) => (
  <div className="group">
    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{artist}</p>
      </div>
      <span className="font-bold text-gray-900">₹{price}</span>
    </div>
    <button className="w-full py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors">
      Buy Piece
    </button>
  </div>
);

const TestimonialCard = ({ name, initial, quote }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex space-x-1 text-yellow-400 mb-4">
      <Star size={16} fill="currentColor" />
      <Star size={16} fill="currentColor" />
      <Star size={16} fill="currentColor" />
      <Star size={16} fill="currentColor" />
      <Star size={16} fill="currentColor" />
    </div>
    <p className="text-gray-600 italic mb-6 leading-relaxed">"{quote}"</p>
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold text-xs">
        {initial}
      </div>
      <span className="font-bold text-sm text-gray-900">{name}</span>
    </div>
  </div>
);

export default App;