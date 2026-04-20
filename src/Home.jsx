import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from './utils/api';
import HeroImage from "./assets/hero.jpg";
import ReviewSection from './submodels/ReviewSection';


const Home = () => {
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/artworks/featured')
      .then(res => setFeaturedArtworks(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) navigate(`/gallery?search=${searchInput}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-white selection:bg-blue-100">
      <main className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
  
  {/* subtle background instead of wave */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/40 via-transparent to-transparent dark:from-gray-900"></div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
          Discover, and Buy Original Art
          <br className="hidden md:block" />
          from World-wide Artists.
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl sm:max-w-2xl mx-auto mb-8 sm:mb-10">
          Buy original art or hire world-class artists to draw custom pieces for you.
        </p>

        {/* SEARCH */}
        <form onSubmit={handleSearch} className="max-w-xl sm:max-w-2xl mx-auto relative mb-12 sm:mb-16">
          <div className="relative flex items-center">
            <Search className="absolute left-3 sm:left-4 text-gray-400" size={18} />

            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search artworks..."
              className="w-full pl-10 sm:pl-12 pr-24 sm:pr-32 py-3 sm:py-4 rounded-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />

            <button
              type="submit"
              className="absolute right-1.5 sm:right-2 top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 rounded-full text-sm sm:text-base font-medium"
            >
              Search
            </button>
          </div>
        </form>

        {/* HERO IMAGE */}
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl bg-gray-50 dark:bg-gray-800 aspect-[16/9] sm:aspect-[16/8]">
          <img src={HeroImage} alt="Art showcase" className="w-full h-full object-cover" />
        </div>
      </main>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 grid grid-cols-3 gap-2 sm:gap-8 text-center">

  <div>
    <div className="text-lg sm:text-3xl font-bold">10,000+</div>
    <div className="text-[10px] sm:text-xs text-gray-500 uppercase">Users</div>
  </div>

  <div className="sm:border-l sm:border-r border-gray-200 dark:border-gray-700">
    <div className="text-lg sm:text-3xl font-bold">5,000+</div>
    <div className="text-[10px] sm:text-xs text-gray-500 uppercase">Sold</div>
  </div>

  <div>
    <div className="text-lg sm:text-3xl font-bold">300+</div>
    <div className="text-[10px] sm:text-xs text-gray-500 uppercase">Artists</div>
  </div>

</div>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Featured Artworks</h2>
            <p className="text-gray-500 dark:text-gray-400">This week's most liked pieces.</p>
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

      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">What our community says</h2>
          <ReviewSection targetType="website" targetId={null} currentUser={currentUser} />
        </div>
      </section>

      <footer className="py-4 border-t border-gray-200 dark:border-gray-800 max-w-7xl mx-auto px-4">

  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">

    <span className="font-semibold text-gray-900 dark:text-white">ArtPool</span>

    <div className="flex gap-3 sm:gap-6">
      <a href="#">About</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
      <a href="#">Contact</a>
    </div>

    <span className="text-gray-400">© 2026</span>

  </div>

</footer>
    </div>
  );
};

const ArtCard = ({ image, title, artist, price, sold, onClick }) => (
  <div className="group cursor-pointer" onClick={onClick}>
    <div className="aspect-square rounded-lg overflow-hidden mb-3 sm:mb-4">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      {sold && (
        <div className="absolute top-4 left-[-28px] w-28 bg-red-500 text-white text-xs font-bold text-center py-1 rotate-[-45deg] origin-center shadow-md">SOLD</div>
      )}
    </div>
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-semibold sm:font-bold text-sm sm:text-base">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-500">{artist}</p>
      </div>
      <span className="font-bold text-gray-900 dark:text-white">₹{price}</span>
    </div>
    <button className="w-full py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition-colors">
      {sold ? 'Sold Out' : 'Buy Piece'}
    </button>
  </div>
);

export default Home;