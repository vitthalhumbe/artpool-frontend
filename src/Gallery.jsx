import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, Loader2, Search, ChevronDown } from 'lucide-react';
import ArtworkDetailModal from './submodels/ArtworkDetailModel';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const CATEGORIES = ['All', 'Painting', 'Sketch', 'Digital', 'Sculpture'];

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedArt, setSelectedArt] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
  }, []);

  const fetchArtworks = useCallback(async (pageNum, searchVal, categoryVal, replace = false) => {
    replace ? setLoading(true) : setLoadingMore(true);
    try {
      const params = { page: pageNum, limit: 12 };
      if (searchVal) params.search = searchVal;
      if (categoryVal && categoryVal !== 'All') params.category = categoryVal;

      const res = await axios.get(`${API}/api/artworks`, { params });
      setArtworks(prev => replace ? res.data.artworks : [...prev, ...res.data.artworks]);
      setTotalPages(res.data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchArtworks(1, search, category, true);
  }, [search, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat === 'All' ? '' : cat);
  };

  const handleLoadMore = () => {
    fetchArtworks(page + 1, search, category, false);
  };

  const openArtwork = async (art) => {
    const optimisticArt = { ...art, stats: { ...art.stats, views: (art.stats?.views || 0) + 1 } };
    setSelectedArt(optimisticArt);
    try {
      const res = await axios.post(`${API}/api/artworks/${art._id}/view`);
      setSelectedArt({ ...res.data, artist: art.artist });
      setArtworks(prev => prev.map(item => item._id === art._id ? { ...res.data, artist: art.artist } : item));
    } catch (e) {
      console.error("View count error", e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <AnimatePresence>
        {selectedArt && (
          <ArtworkDetailModal
            artwork={selectedArt}
            currentUser={currentUser}
            close={() => setSelectedArt(null)}
            onDelete={(id) => { setArtworks(prev => prev.filter(g => g._id !== id)); setSelectedArt(null); }}
            onUpdate={(updated) => { setArtworks(prev => prev.map(g => g._id === updated._id ? updated : g)); setSelectedArt(updated); }}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900">The Gallery</h1>
          <form onSubmit={handleSearch} className="w-full md:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by title, tag..."
              className="w-full pl-11 pr-24 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <button type="submit" className="absolute right-2 top-1.5 bottom-1.5 px-4 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700">
              Search
            </button>
          </form>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                (cat === 'All' && !category) || category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-32 text-gray-400 font-medium">No artworks found.</div>
        ) : (
          <>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {artworks.map((art) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={art._id}
                  onClick={() => openArtwork(art)}
                  className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group relative mb-4"
                >
                  <img src={art.images[0]} className="w-full h-auto object-cover" alt={art.title} />
                  {art.sold && (
  <div className="absolute top-4 left-[-28px] w-28 bg-red-500 text-white text-xs font-bold text-center py-1 rotate-[-45deg] origin-center shadow-md">
    SOLD
  </div>
)}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">{art.title}</h3>
                    <p className="text-gray-300 text-sm mb-3">by @{art.artist?.username || 'Unknown'}</p>
                    <div className="flex items-center gap-4 text-white font-bold text-sm">
                      <span className="flex items-center gap-1.5"><Heart size={16} fill="white" /> {art.stats?.likes || 0}</span>
                      <span className="flex items-center gap-1.5"><Eye size={16} /> {art.stats?.views || 0}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            {page < totalPages && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-700 hover:border-gray-400 shadow-sm transition-all"
                >
                  {loadingMore ? <Loader2 size={18} className="animate-spin" /> : <><ChevronDown size={18} /> Load More</>}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Gallery;