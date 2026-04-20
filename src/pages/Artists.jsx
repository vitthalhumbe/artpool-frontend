import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search, Star, Users, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Artists = () => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [sort, setSort] = useState('followers');
    const navigate = useNavigate();

    useEffect(() => {
        fetchArtists();
    }, [sort]);

    const fetchArtists = async (search = '') => {
        setLoading(true);
        try {
            const res = await api.get(`/api/auth/artists`, {
                params: { search, sort }
            });
            setArtists(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchArtists(searchInput);
    };

    return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Artists</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Discover talented creators on ArtPool.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search artists..."
                className="w-full sm:w-64 pl-11 pr-4 py-3 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-500 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
              />
            </form>
            <div className="flex gap-2">
              <button
                onClick={() => setSort('followers')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${sort === 'followers' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400'}`}
              >
                Most Followed
              </button>
              <button
                onClick={() => setSort('rating')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${sort === 'rating' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400'}`}
              >
                Highest Rated
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-32"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : artists.length === 0 ? (
          <div className="text-center py-32 text-gray-400 dark:text-gray-500 font-medium">No artists found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artists.map(artist => (
              <div
                key={artist._id}
                onClick={() => navigate(`/profile/${artist._id}`)}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="h-24 bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
                  <img src={artist.profile?.banner_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="banner" />
                </div>
                <div className="px-5 pb-5">
                  <div className="w-16 h-16 rounded-xl border-4 border-white dark:border-gray-800 shadow-md overflow-hidden -mt-8 mb-3 bg-white dark:bg-gray-700 relative z-10">
                    <img src={artist.profile?.avatar_url} className="w-full h-full object-cover" alt={artist.username} />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{artist.username}</h3>
                  <p className="text-xs text-blue-600 mb-2">@{artist.username.replace(/\s+/g, '_').toLowerCase()}</p>
                  {artist.profile?.bio && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{artist.profile.bio}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><Users size={13} className="text-blue-500" />{artist.followers?.length || 0} followers</span>
                    {artist.metrics?.average_rating > 0 && (
                      <span className="flex items-center gap-1"><Star size={13} className="text-yellow-400 fill-yellow-400" />{artist.metrics.average_rating}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Artists;