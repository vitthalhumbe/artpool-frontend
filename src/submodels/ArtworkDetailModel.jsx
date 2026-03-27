import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Eye, Share2, Heart, X, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ArtworkDetailModal = ({ artwork, currentUser, close, onDelete, onUpdate }) => {
    const isOwner = currentUser
        ? (currentUser._id === artwork.artist || currentUser._id === artwork.artist?._id)
        : false;

    const [likes, setLikes] = useState(artwork.stats?.likes || 0);
    const [likedByUser, setLikedByUser] = useState(
        currentUser ? artwork.stats?.likes_users?.includes(currentUser._id) : false
    );
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const navigate = useNavigate();

    const handleLike = async () => {
        if (!currentUser) { setShowLoginPrompt(true); return; }
        if (isOwner) return;
        const newState = !likedByUser;
        setLikedByUser(newState);
        setLikes(prev => newState ? prev + 1 : prev - 1);
        try {
            await axios.post(`${API}/api/artworks/${artwork._id}/like`, { userId: currentUser._id });
        } catch (err) {
            setLikedByUser(!newState);
            setLikes(prev => !newState ? prev + 1 : prev - 1);
        }
    };

    const handleDelete = async () => {
        if (confirm("Delete this artwork?")) {
            await axios.delete(`${API}/api/artworks/${artwork._id}`);
            onDelete(artwork._id);
        }
    };

    const handleHireClick = () => {
        if (!currentUser) { setShowLoginPrompt(true); return; }
        console.log("hire clicked");
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={close}>

            {/* Login prompt */}
            {showLoginPrompt && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50" onClick={e => e.stopPropagation()}>
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
                        <h3 className="text-xl font-bold mb-2">Join ArtPool</h3>
                        <p className="text-gray-500 mb-6">You need an account to do that.</p>
                        <button onClick={() => navigate('/login')} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl mb-3">Log In</button>
                        <button onClick={() => setShowLoginPrompt(false)} className="w-full py-3 text-gray-500 font-medium">Cancel</button>
                    </div>
                </div>
            )}

            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={e => e.stopPropagation()}
                className="bg-white w-full max-w-7xl h-[90vh] rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-2xl"
            >
                {/* LEFT: Image Grid */}
                <div className="w-full lg:w-3/4 bg-gray-100 overflow-y-auto p-4 custom-scrollbar">
                    <div className={`grid gap-4 h-full ${
                        artwork.images.length === 1 ? 'grid-cols-1' :
                        artwork.images.length === 2 ? 'grid-cols-2' :
                        artwork.images.length === 3 ? 'grid-cols-2 grid-rows-2' :
                        'grid-cols-2 md:grid-cols-3'
                    }`}>
                        {artwork.images.map((img, idx) => (
                            <div key={idx} className={`relative rounded-xl overflow-hidden shadow-sm group ${
                                artwork.images.length === 3 && idx === 0 ? 'row-span-2' :
                                artwork.images.length >= 4 && idx === 0 ? 'col-span-2 row-span-2' : ''
                            }`}>
                                <img src={img} className="w-full h-full object-cover" alt="Detail" />
                                <div
                                    onClick={() => window.open(img, '_blank')}
                                    className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                                >
                                    <Share2 size={16} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Info Panel */}
                <div className="w-full lg:w-1/4 bg-white flex flex-col border-l border-gray-100">

                    {/* Top Artist Bar */}
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                        <div
                            onClick={() => {
                                close();
                                navigate(`/profile/${artwork.artist?._id || artwork.artist}`);
                            }}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-200 group-hover:ring-2 group-hover:ring-blue-500 transition-all">
                                <img
                                    src={
                                        isOwner
                                            ? currentUser?.profile?.avatar_url
                                            : (artwork.artist?.profile?.avatar_url || `https://ui-avatars.com/api/?name=${artwork.artist?.username || 'Artist'}&background=random`)
                                    }
                                    className="w-full h-full object-cover"
                                    alt="Avatar"
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                    {isOwner ? "You" : (artwork.artist?.username || "The Artist")}
                                </h4>
                                <p className="text-xs text-gray-500">Creator</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {!isOwner && (
                                <button
                                    onClick={handleHireClick}
                                    className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                                >
                                    <Briefcase size={14} /> Hire
                                </button>
                            )}
                            <button onClick={close} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Middle Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">{artwork.title}</h1>
                        <p className="text-2xl font-extrabold text-blue-600 mb-6">₹{artwork.price}</p>
                        <div className="prose prose-sm text-gray-600 mb-6 whitespace-pre-wrap break-words">
                            <p>{artwork.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase">{artwork.category || "Art"}</span>
                            {artwork.tags?.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">#{tag}</span>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-6 text-sm font-medium text-gray-500">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1"><Eye size={18} /> {artwork.stats?.views || 1}</span>
                                <span className="flex items-center gap-1">
                                    <Heart size={18} className={likedByUser ? "text-red-500 fill-red-500" : ""} /> {likes}
                                </span>
                            </div>
                            <span>{new Date(artwork.createdAt).toLocaleDateString()}</span>
                        </div>

                        {isOwner ? (
                            <button
                                onClick={handleDelete}
                                className="w-full py-3.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 flex items-center justify-center gap-2 transition-colors"
                            >
                                <Trash2 size={18} /> Delete Artwork
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={handleLike}
                                    className={`p-3.5 rounded-xl border transition-colors ${likedByUser ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-red-500'}`}
                                >
                                    <Heart size={24} fill={likedByUser ? "currentColor" : "none"} />
                                </button>
                                <button
                                    onClick={() => {
                                        if (!currentUser) { setShowLoginPrompt(true); return; }
                                        console.log("Proceed to checkout!");
                                    }}
                                    className="flex-1 py-3.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-gray-300"
                                >
                                    Buy Original
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ArtworkDetailModal;