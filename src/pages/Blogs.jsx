import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';
import { X } from 'lucide-react';
import api from '../utils/api';

const ReadBlogModal = ({ blog, close }) => {
  if (!blog) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={close}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 w-full max-w-5xl h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden relative"
      >
        <button onClick={close} className="absolute top-4 right-4 z-10 p-3 bg-white/50 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-md rounded-full shadow-sm transition-all">
          <X size={20} className="text-gray-900 dark:text-white" />
        </button>
        <div className="flex-1 overflow-y-auto pb-20">
          {blog.coverImage && (
            <div className="w-full h-64 md:h-80 bg-gray-100 dark:bg-gray-800 relative">
              <img src={blog.coverImage} className="w-full h-full object-cover" alt="Cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}
          <div className="px-8 md:px-16 pt-10">
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">{blog.title}</h1>
              <div className="flex items-center gap-4 border-y border-gray-100 dark:border-gray-700 py-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img src={blog.artist?.profile?.avatar_url} className="w-full h-full object-cover" alt="Author" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{blog.artist?.username || 'Artist'}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(blog.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div
              className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed break-words overflow-x-hidden w-full"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async (search = '') => {
    setLoading(true);
    try {
      const res = await api.get('/api/blogs', { params: search ? { search } : {} });
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchBlogs(searchInput); };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <AnimatePresence>
        {selectedBlog && <ReadBlogModal blog={selectedBlog} close={() => setSelectedBlog(null)} />}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Stories</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Creative process, inspiration, and art from our community.</p>
          </div>
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search stories..."
              className="w-full pl-11 pr-24 py-3 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-500 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
            />
            <button type="submit" className="absolute right-2 top-1.5 bottom-1.5 px-4 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700">Search</button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-32"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-32 text-gray-400 dark:text-gray-500 font-medium">No stories yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map(blog => (
              <motion.div key={blog._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedBlog(blog)}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="w-full h-52 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  {blog.coverImage
                    ? <img src={blog.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-medium">No Cover</div>
                  }
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">{blog.title}</h2>
                  <div className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-4"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }} />
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={e => { e.stopPropagation(); navigate(`/profile/${blog.artist?._id}`); }}>
                      <img src={blog.artist?.profile?.avatar_url} className="w-7 h-7 rounded-full object-cover" alt={blog.artist?.username} />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">{blog.artist?.username}</span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
