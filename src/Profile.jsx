import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Users, ShoppingBag, Settings, Edit3, BookOpen, 
  User, Eye, Share2, Camera, Heart, CheckCircle, Clock, Loader2, MapPin, Plus, Image as ImageIcon 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditProfileModal from './submodels/EditProfileModel';
import AddArtworkModal from './submodels/AddArtworkModel';
import ArtworkDetailModal from './submodels/ArtworkDetailModel';


const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('gallery');
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isAddingArt, setIsAddingArt] = useState(false);
  const [gallery, setGallery] = useState([]);

  const [selectedArt, setSelectedArt] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setActiveTab(parsedUser.role === 'artist' ? 'gallery' : 'liked');
      fetchArtworks(parsedUser._id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchArtworks = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/artworks/user/${userId}`);
      setGallery(res.data);
    } catch (err) {
      console.error("Failed to fetch art", err);
    }
  };
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
    data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
      data
    );
    return res.data.secure_url;
  };

  const handleProfileImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      const updateData = { 
        userId: user._id, 
        [type === 'avatar' ? 'avatar_url' : 'banner_url']: imageUrl 
      };
      const backendRes = await axios.put("http://localhost:5000/api/auth/update-profile", updateData);
      const updatedUser = backendRes.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert(`${type === 'avatar' ? 'Profile picture' : 'Banner'} updated!`);

    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };
  const handleAddArtwork = async (artData) => {
    try {
        const res = await axios.post("http://localhost:5000/api/artworks", {
            ...artData,
            artist: user._id
        });
        setGallery([res.data, ...gallery]); 
        setIsAddingArt(false);
    } catch (err) {
        alert("Failed to publish artwork");
    }
  };
  const handleProfileUpdate = async (updatedData) => {
    try {
        const payload = { userId: user._id, ...updatedData };
        const res = await axios.put("http://localhost:5000/api/auth/update-profile", payload);
        
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        setIsEditing(false);
        alert("Profile updated successfully!");
    } catch (error) {
        alert("Failed to update profile.");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  };

  const openArtwork = async (art) => {
    const optimisticArt = { 
        ...art, 
        stats: { ...art.stats, views: (art.stats?.views || 0) + 1 } 
    };
    setSelectedArt(optimisticArt);
    try {
      const res = await axios.post(`http://localhost:5000/api/artworks/${art._id}/view`);
      const updatedArt = res.data;
      setSelectedArt(updatedArt); 
      setGallery(prev => prev.map(item => item._id === art._id ? updatedArt : item));
    } catch (e) { console.error("View sync failed", e); }
  };
  const onArtDeleted = (id) => {
    setGallery(gallery.filter(g => g._id !== id));
    setSelectedArt(null);
  };
  const onArtUpdated = (updatedArt) => {
    setGallery(gallery.map(g => g._id === updatedArt._id ? updatedArt : g));
    setSelectedArt(updatedArt);
  };
  if (!user) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin"/></div>;
  const isArtist = user.role === 'artist';

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      
      <AnimatePresence>
        {isEditing && <EditProfileModal user={user} close={() => setIsEditing(false)} save={handleProfileUpdate} />}
        
        {isAddingArt && <AddArtworkModal 
            close={() => setIsAddingArt(false)} 
            save={handleAddArtwork} 
            uploadImage={uploadToCloudinary} 
        />}

        {selectedArt && (
          <ArtworkDetailModal 
            artwork={selectedArt} 
            currentUser={user}
            close={() => setSelectedArt(null)}
            onDelete={(id) => { setGallery(gallery.filter(g => g._id !== id)); setSelectedArt(null); }}
            onUpdate={(updated) => { setGallery(gallery.map(g => g._id === updated._id ? updated : g)); setSelectedArt(updated); }}
          />
        )}
      </AnimatePresence>
      <div className="bg-white pb-4 shadow-sm relative z-10">
        <div className="h-64 w-full bg-gray-200 overflow-hidden relative group">
          <img src={user.profile?.banner_url || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2000&auto=format&fit=crop"} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors"></div>
          
          <label className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
            {uploading ? <Loader2 size={20} className="animate-spin"/> : <Camera size={20} />}
            <input type="file" className="hidden" onChange={(e) => handleProfileImageUpload(e, 'banner')} disabled={uploading} />
          </label>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-end -mt-20 mb-6 gap-6">
            <div className="relative group">
              <div className="w-40 h-40 rounded-2xl border-[6px]  border-white shadow-2xl overflow-hidden bg-white">
                {user.profile?.avatar_url ? <img src={user.profile.avatar_url} alt={user.username} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400"><User size={48} /></div>}
              </div>
              
              <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110">
                {uploading ? <Loader2 size={16} className="animate-spin"/> : <Camera size={16} />}
                <input type="file" className="hidden" onChange={(e) => handleProfileImageUpload(e, 'avatar')} disabled={uploading} />
              </label>
            </div>

            <div className="flex-1 pb-2 mt-20  w-full text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">{user.username}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500 mt-2 font-medium">
                <span className="text-blue-600">@{user.username.replace(/\s+/g, '_').toLowerCase()}</span>
                {user.profile?.location && <span className="flex items-center gap-1"><MapPin size={16}/> {user.profile.location}</span>}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-6 mt-4">
                 <StatItem icon={Star} value="4.9" label="Rating" color="text-yellow-400" />
                 <div className="w-px h-4 bg-gray-300 hidden md:block"></div>
                 <StatItem icon={Users} value="1.2k" label="Followers" color="text-blue-600" />
                 <div className="w-px h-4 bg-gray-300 hidden md:block"></div>
                 <StatItem icon={ShoppingBag} value={gallery.length || "0"} label="Sold" color="text-purple-600" />
              </div>
            </div>

            <div className="flex gap-3 mb-2 w-full md:w-auto justify-center">
               <button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-200"><Edit3 size={18} /> Edit Profile</button>
               <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600"><Settings size={20} /></button>
               <button onClick={handleShare} className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600"><Share2 size={20} /></button>
            </div>
          </div>

          <div className="flex gap-8 border-b border-gray-200 mt-8 overflow-x-auto no-scrollbar">
            {isArtist ? (
              <>
                <TabButton active={activeTab} name="gallery" label="Gallery" onClick={setActiveTab} />
                <TabButton active={activeTab} name="blogs" label="Blogs" onClick={setActiveTab} />
                <TabButton active={activeTab} name="about" label="About" onClick={setActiveTab} />
                <TabButton active={activeTab} name="dashboard" label="Dashboard" onClick={setActiveTab} />
              </>
            ) : (
              <>
                <TabButton active={activeTab} name="liked" label="Liked Art" onClick={setActiveTab} />
                <TabButton active={activeTab} name="dashboard" label="My Dashboard" onClick={setActiveTab} />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'gallery' && (
            <div className="w-full">
              
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                
                {isArtist && (
                  <div onClick={() => setIsAddingArt(true)} className="break-inside-avoid aspect-square border-3 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors mb-4">
                     <Plus size={32} className="text-gray-400 mb-2"/>
                     <span className="font-bold text-gray-500">Add Art</span>
                  </div>
                )}
                {gallery.map((art) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    key={art._id} 
                    onClick={() => openArtwork(art)}
                    className=" break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative mb-4"
                  >
                     <img src={art.images[0]} className="w-full h-auto object-cover" alt={art.title} />
                     
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold">
                        <span className="flex items-center gap-1"><Heart size={16} fill="white"/> {art.stats?.likes || 0}</span>
                        <span className="flex items-center gap-1"><Eye size={16}/> {art.stats?.views || 0}</span>
                     </div>
                  </motion.div>
                ))}
              </div>

            </div>
          )}
          {activeTab === 'blogs' && <EmptyState icon={BookOpen} title="No Stories Yet" desc="Start writing." />}
          {activeTab === 'about' && <div className="bg-white p-8 rounded-2xl border border-gray-100"><p>{user.profile?.bio || "No bio yet."}</p></div>}
          {activeTab === 'liked' && <EmptyState icon={Heart} title="No Liked Art" desc="Explore the gallery." />}
          {activeTab === 'dashboard' && <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DashboardCard title={isArtist ? "Pending Requests" : "My Commissions"} count="2" icon={Clock} color="bg-orange-100 text-orange-600" />
              <DashboardCard title={isArtist ? "Completed Works" : "Purchase History"} count="12" icon={CheckCircle} color="bg-green-100 text-green-600" />
              <DashboardCard title={isArtist ? "Total Earnings" : "Saved Artists"} count={isArtist ? "₹45k" : "5"} icon={isArtist ? ShoppingBag : Users} color="bg-blue-100 text-blue-600" />
          </div>}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StatItem = ({ 
    icon: Icon, 
    value, 
    label, 
    color }) => (
        <div className="flex items-center gap-2">
            <Icon size={20} className={color} />
            <span className="font-bold text-gray-900 text-lg">{value}</span>
            <span className="text-gray-500 text-xs font-bold uppercase hidden sm:block">{label}</span>
        </div>
);


const TabButton = ({ active, name, label, onClick }) => (
    <button onClick={() => onClick(name)} 
            className={`pb-4 text-sm font-bold uppercase relative ${active === name ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
            {label}
            {active === name && 
                <motion.div layoutId="activeTab" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            }
    </button>
);

const EmptyState = ({ icon: Icon, title, desc }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
            <Icon size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-500 mt-1">{desc}</p>
    </div>
);
const DashboardCard = ({ title, count, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-transform hover:-translate-y-1">
        <div>
            <p className="text-gray-500 text-sm font-bold uppercase mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900">{count}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={24} />
        </div>
    </div>
);

export default Profile;