import React, { useState, useEffect } from 'react';
import { Search, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeroImage from "./assets/hero.jpg";
import ReviewSection from './submodels/ReviewSection';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Home = () => {
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/api/artworks/featured`)
      .then(res => setFeaturedArtworks(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) navigate(`/gallery?search=${searchInput}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100">

      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Discover, and Buy Original Art <br className="hidden md:block" /> from World-wide Artists.
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          Buy original art or hire world-class artists to draw custom pieces for you.
        </p>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative mb-16">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-gray-400" size={20} />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search for oil paintings, sketches, artists..."
              className="w-full pl-12 pr-32 py-4 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full font-medium transition-colors">
              Search
            </button>
          </div>
        </form>

        <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-50 aspect-[16/8]">
          <img src={HeroImage} alt="Art showcase" className="w-full h-full object-cover" />
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
            <p className="text-gray-500">This week's most liked pieces.</p>
          </div>
          <Link to="/gallery" className="text-blue-600 font-semibold hover:underline hidden sm:block">View Gallery →</Link>
        </div>

        {featuredArtworks.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No featured artworks yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredArtworks.map(art => (
              <ArtCard
                key={art._id}
                title={art.title}
                artist={art.artist?.username || 'Unknown'}
                price={art.price}
                image={art.images[0]}
                sold={art.sold}
                onClick={() => navigate('/gallery')}
              />
            ))}
          </div>
        )}
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">What our community says</h2>
          <ReviewSection
            targetType="website"
            targetId={null}
            currentUser={currentUser}
          />
        </div>
      </section>

      <footer className="py-12 border-t border-gray-200 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="text-xl font-bold mb-4 md:mb-0">ArtPool</div>
        <div className="text-sm text-gray-400 mt-4 md:mt-0">© 2026 ArtPool Inc.</div>
      </footer>
    </div>
  );
};

const ArtCard = ({ image, title, artist, price, sold, onClick }) => (
  <div className="group cursor-pointer" onClick={onClick}>
    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      {sold && (
        <div className="absolute top-4 left-[-28px] w-28 bg-red-500 text-white text-xs font-bold text-center py-1 rotate-[-45deg] origin-center shadow-md">
          SOLD
        </div>
      )}
    </div>
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{artist}</p>
      </div>
      <span className="font-bold text-gray-900">₹{price}</span>
    </div>
    <button className="w-full py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors">
      {sold ? 'Sold Out' : 'Buy Piece'}
    </button>
  </div>
);

export default Home;