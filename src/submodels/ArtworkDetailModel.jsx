import  { useState } from 'react';
import { motion } from 'framer-motion';
import {Trash2, Eye, Share2, Heart,  X } from 'lucide-react';
import axios from 'axios';

const ArtworkDetailModal = ({ artwork, currentUser, close, onDelete, onUpdate }) => {
    const isOwner = currentUser._id === artwork.artist || currentUser._id === artwork.artist?._id;
    const [likes, setLikes] = useState(artwork.stats?.likes || 0);
    const [likedByUser, setLikedByUser] = useState(artwork.stats?.likes_users?.includes(currentUser._id));

    const handleLike = async () => {
        if (isOwner) return;
        const newState = !likedByUser;
        setLikedByUser(newState);
        setLikes(prev => newState ? prev + 1 : prev - 1);
        try { await axios.post(`http://localhost:5000/api/artworks/${artwork._id}/like`, { userId: currentUser._id }); }
        catch (err) { setLikedByUser(!newState); setLikes(prev => !newState ? prev + 1 : prev - 1); }
    };

    const handleDelete = async () => {
        if (confirm("Delete this artwork?")) {
            await axios.delete(`http://localhost:5000/api/artworks/${artwork._id}`);
            onDelete(artwork._id);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={close}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()} className="bg-white w-full max-w-7xl h-[90vh] rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-2xl">
                <div className="w-full lg:w-3/4 bg-gray-100 overflow-y-auto p-4 custom-scrollbar">
                    <div className={`grid gap-4 h-full ${artwork.images.length === 1 ? 'grid-cols-1' :
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
                                <div onClick={() => window.open(img, '_blank')} className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                    <Share2 size={16} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full lg:w-1/4 bg-white flex flex-col border-l border-gray-100">
                    <div className="p-6 border-b border-gray-100 flex justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                <img src={isOwner ? currentUser.profile.avatar_url : (artwork.artist?.profile?.avatar_url || currentUser.profile.avatar_url)} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900">{isOwner ? "You" : "The Artist"}</h4>
                                <p className="text-xs text-gray-500">Creator</p>
                            </div>
                        </div>
                        <button onClick={close} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto">
                        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">{artwork.title}</h1>
                        <p className="text-xl font-medium text-blue-600 mb-6">₹{artwork.price}</p>

                        <div className="prose prose-sm text-gray-600 mb-6">
                            <p>{artwork.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase">{artwork.category}</span>
                            {artwork.tags?.map(tag => <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">#{tag}</span>)}
                        </div>
                    </div>
                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-6 text-sm font-medium text-gray-500">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1"><Eye size={18} /> {artwork.stats?.views}</span>
                                <span className="flex items-center gap-1"><Heart size={18} className={likedByUser ? "text-red-500 fill-red-500" : ""} /> {likes}</span>
                            </div>
                            <span>{new Date(artwork.createdAt).toLocaleDateString()}</span>
                        </div>

                        {isOwner ? (
                            <button onClick={handleDelete} className="w-full py-3.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 flex items-center justify-center gap-2"><Trash2 size={18} /> Delete Artwork</button>
                        ) : (
                            <div className="flex gap-3">
                                <button onClick={handleLike} className={`p-3.5 rounded-xl border ${likedByUser ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400'}`}><Heart size={24} fill={likedByUser ? "currentColor" : "none"} /></button>
                                <button className="flex-1 py-3.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 flex items-center justify-center gap-2"><Briefcase size={18} /> Hire Artist</button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ArtworkDetailModal;