import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, Loader2, Search , Briefcase} from 'lucide-react';
import ArtworkDetailModal from './submodels/ArtworkDetailModel';

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [selectedArt, setSelectedArt] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (so they can like posts)
    const storedUser = localStorage.getItem('user');
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    
    fetchAllArtworks();
  }, []);
  const fetchAllArtworks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/artworks');
      setArtworks(res.data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const openArtwork = async (art) => {
    const optimisticArt = { ...art, stats: { ...art.stats, views: (art.stats?.views || 0) + 1 } };
    setSelectedArt(optimisticArt);

    try {
      const res = await axios.post(`http://localhost:5000/api/artworks/${art._id}/view`);
      setSelectedArt(res.data);
      setArtworks(prev => prev.map(item => item._id === art._id ? res.data : item));
    } catch (e) { console.error("View count error", e); }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-20"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <AnimatePresence>
        {selectedArt && (
          <ArtworkDetailModal 
            artwork={selectedArt} 
            currentUser={currentUser}
            close={() => setSelectedArt(null)}
            onDelete={(id) => { 
                setArtworks(artworks.filter(g => g._id !== id)); 
                setSelectedArt(null); 
            }}
            onUpdate={(updated) => { 
                setArtworks(artworks.map(g => g._id === updated._id ? updated : g)); 
                setSelectedArt(updated); 
            }}
          />
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">The Gallery</h1>
          </div>
          
          {/* Quick Search Bar */}
          <div className="w-full md:w-96 relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
             <input 
               type="text" 
               placeholder="Search by tag, category..." 
               className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
             />
          </div>
        </div>
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
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg leading-tight mb-1">{art.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">by @{art.artist?.username || 'Unknown'}</p>
                  
                  <div className="flex items-center gap-4 text-white font-bold text-sm">
                    <span className="flex items-center gap-1.5"><Heart size={16} fill="white"/> {art.stats?.likes || 0}</span>
                    <span className="flex items-center gap-1.5"><Eye size={16}/> {art.stats?.views || 0}</span>
                  </div>
               </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Gallery;