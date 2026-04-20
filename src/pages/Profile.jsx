import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';
import {
  Users, ShoppingBag, Settings, Edit3, BookOpen, X,
  User, Eye, Share2, Camera, Heart, Loader2, MapPin, Plus, Image as ImageIcon, IndianRupee, Calendar
} from 'lucide-react';

import api from '../utils/api';

import EditProfileModal from '../submodels/EditProfileModel';
import AddArtworkModal from '../submodels/AddArtworkModel';
import ArtworkDetailModal from '../submodels/ArtworkDetailModel';
import CommissionModal from '../submodels/CommisionModel';
import ReviewSection from '../submodels/ReviewSection';

import { useToast } from '../context/ToastContext';

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [isOwner, setIsOwner] = useState(true);

  const [activeTab, setActiveTab] = useState('gallery');
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isAddingArt, setIsAddingArt] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null);

  const [blogs, setBlogs] = useState([]);
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const [orders, setOrders] = useState([]);
  const [likedArtworks, setLikedArtworks] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [showCommissionForm, setShowCommissionForm] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [showNegotiateModal, setShowNegotiateModal] = useState(null);

  const { toast } = useToast();

  const handleUpdateStatus = async (commissionId, newStatus, e) => {
    e.stopPropagation();
    setCommissions(prev => prev.map(c => c._id === commissionId ? { ...c, status: newStatus } : c));

    try {
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user'))?.token;
      await api.put(`/api/commissions/${commissionId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      toast({ message: 'Failed to update status.', type: 'error' });
    }
  };

  useEffect(() => {
    let isMounted = true;
    const storedUser = localStorage.getItem('user');
    const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

    const fetchProfileData = async () => {
      try {
        let targetUserId;
        let profileData;
        if (id && (!loggedInUser || id !== loggedInUser._id)) {
          targetUserId = id;
          if (isMounted) setIsOwner(false);
          const userRes = await api.get(`/api/auth/users/${id}`);
          profileData = userRes.data;
        } else if (loggedInUser) {
          targetUserId = loggedInUser._id;
          profileData = loggedInUser;
          if (isMounted) setIsOwner(true);
        } else {
          navigate('/login');
          return;
        }

        if (isMounted) {
          setUser(profileData);
          setActiveTab(profileData.role === 'artist' ? 'gallery' : 'liked');
          setFollowersCount(profileData.followers?.length || 0);
          setFollowingCount(profileData.following?.length || 0);
          if (loggedInUser && profileData._id !== loggedInUser._id) {
            setIsFollowing(profileData.followers?.includes(loggedInUser._id));
          }
        }
        const artRes = await api.get(`/api/artworks/user/${targetUserId}`);
        const blogRes = await api.get(`/api/blogs/user/${targetUserId}`);
        const likedRes = await api.get(`/api/artworks/liked/${targetUserId}`);

        let commRes = { data: [] };
        if (isMounted && loggedInUser && targetUserId === loggedInUser._id) {
          commRes = await api.get(`/api/commissions/user/${targetUserId}`);
        }

        let ordersRes = { data: [] };
        if (isMounted && loggedInUser && targetUserId === loggedInUser._id) {
          ordersRes = await api.get(`/api/orders/user/${targetUserId}`);
        }

        if (isMounted) {
          setGallery(artRes.data);
          setBlogs(blogRes.data);
          setCommissions(commRes.data);
          setOrders(ordersRes.data);
          setLikedArtworks(likedRes.data);
        }
      } catch (err) {
        if (api.isCancel(err) || err.name === "CanceledError") return;
        console.error("Fetch failed:", err);
      }
    };

    fetchProfileData();
    return () => { isMounted = false; };
  }, [id, navigate]);

  const handleAddBlog = async (blogData) => {
    try {
      const res = await api.post("/api/blogs", {
        ...blogData,
        artist: user._id
      });
      setBlogs([res.data, ...blogs]);
      setIsAddingBlog(false);
    } catch (err) { toast({ message: 'Failed to publish blog.', type: 'error' }); }
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
    data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

    const res = await api.post(
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
      const backendRes = await api.put("/api/auth/update-profile", updateData);
      const updatedUser = backendRes.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast({ message: `${type === 'avatar' ? 'Profile picture' : 'Banner'} updated!`, type: 'success' });
    } catch (err) {
      toast({ message: 'Failed to upload image.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleAddArtwork = async (artData) => {
    try {
      const res = await api.post("/api/artworks", {
        ...artData,
        artist: user._id
      });
      setGallery([res.data, ...gallery]);
      setIsAddingArt(false);
      toast({ message: 'Artwork published!', type: 'success' });
    } catch (err) {
      toast({ message: 'Failed to publish artwork.', type: 'error' });
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const payload = { userId: user._id, ...updatedData };
      const res = await api.put("/api/auth/update-profile", payload);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setIsEditing(false);
      toast({ message: 'Profile updated!', type: 'success' });
    } catch (error) {
      toast({ message: 'Failed to update profile.', type: 'error' });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ message: 'Link copied!', type: 'info' });
  };
  
  const fetchOrders = async () => {
    try {
      const res = await api.get(`/api/orders/user/${user._id}`, {
        params: { t: Date.now() }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };
  
  const openArtwork = async (art) => {
    const optimisticArt = {
      ...art,
      stats: { ...art.stats, views: (art.stats?.views || 0) + 1 }
    };
    setSelectedArt(optimisticArt);

    try {
      const res = await api.post(`/api/artworks/${art._id}/view`);

      const updatedArt = {
        ...res.data,
        artist: art.artist
      };

      setSelectedArt(updatedArt);
      setGallery(prev => prev.map(item => item._id === art._id ? updatedArt : item));
    } catch (e) {
      console.error("View sync failed", e);
    }
  };
  
  if (!user) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  const isArtist = user.role === 'artist';

  const handleFollowToggle = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return navigate('/login');
    const loggedInUser = JSON.parse(storedUser);
    if (!loggedInUser.following) {
      loggedInUser.following = [];
    }

    const newIsFollowing = !isFollowing;
    setIsFollowing(newIsFollowing);
    setFollowersCount(prev => newIsFollowing ? prev + 1 : prev - 1);

    try {
      const res = await api.put(`/api/auth/users/${user._id}/follow`, {
        currentUserId: loggedInUser._id
      });
      if (res.data.isFollowing) {
        loggedInUser.following.push(user._id);
      } else {
        loggedInUser.following = loggedInUser.following.filter(id => id !== user._id);
      }
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } catch (err) {
      setIsFollowing(isFollowing);
      setFollowersCount(prev => isFollowing ? prev + 1 : prev - 1);
      console.error("Follow failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-white pb-20">
      <AnimatePresence>
        {isEditing && <EditProfileModal user={user} close={() => setIsEditing(false)} save={handleProfileUpdate} />}
        {isAddingArt && <AddArtworkModal close={() => setIsAddingArt(false)} save={handleAddArtwork} uploadImage={uploadToCloudinary} />}
        {isAddingBlog && <AddBlogModal close={() => setIsAddingBlog(false)} save={handleAddBlog} uploadImage={uploadToCloudinary} />}
        {selectedBlog && <ReadBlogModal blog={selectedBlog} user={user} close={() => setSelectedBlog(null)} />}
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

      <AnimatePresence>
        {showCommissionForm && (
          <CommissionModal artist={user} currentUser={JSON.parse(localStorage.getItem('user'))} close={() => setShowCommissionForm(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNegotiateModal && (
          <CommissionModal
            artist={showNegotiateModal.artist}
            currentUser={JSON.parse(localStorage.getItem('user'))}
            existingCommission={showNegotiateModal}
            close={() => setShowNegotiateModal(null)}
            onUpdate={(updated) => {
              setCommissions(prev => prev.map(c => c._id === updated._id ? updated : c));
              setShowNegotiateModal(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCommission && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCommission(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()} className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Commission Details</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status: <span className="font-bold uppercase text-blue-600">{selectedCommission.status}</span></p>
                </div>
                <button onClick={() => setSelectedCommission(null)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={18} className="dark:text-gray-300" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description</p>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{selectedCommission.description}</div>
                </div>
                <div className="flex gap-6">
                  <div>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Budget</p>
                    <p className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center"><IndianRupee size={18} />{selectedCommission.budget}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Deadline</p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">{new Date(selectedCommission.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                {selectedCommission.referenceImages && selectedCommission.referenceImages.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Reference Images</p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {selectedCommission.referenceImages.map((img, idx) => (
                        <div key={idx} onClick={() => window.open(img, '_blank')} className="w-20 h-20 rounded-xl overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 hover:ring-2 hover:ring-blue-500">
                          <img src={img} alt="Ref" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {['pending', 'negotiating'].includes(selectedCommission.status) && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => { setSelectedCommission(null); setShowNegotiateModal(selectedCommission); }}
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Negotiate Terms
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 pb-4 shadow-sm relative z-10">
        <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden relative group">
          <img src={user.profile?.banner_url || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2000&auto=format&fit=crop"} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors"></div>
          {isOwner && (
            <label className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
              {uploading ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
              <input type="file" className="hidden" onChange={(e) => handleProfileImageUpload(e, 'banner')} disabled={uploading} />
            </label>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-20 mb-6 gap-4 md:gap-6 text-center md:text-left">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-2xl border-[6px] border-white dark:border-gray-900 shadow-2xl overflow-hidden bg-white dark:bg-gray-800">
                {user.profile?.avatar_url
                  ? <img src={user.profile.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400"><User size={48} /></div>
                }
              </div>
              {isOwner && (
                <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110">
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                  <input type="file" className="hidden" onChange={(e) => handleProfileImageUpload(e, 'avatar')} disabled={uploading} />
                </label>
              )}
            </div>

            <div className="flex-1 pb-2 mt-4 md:mt-20 w-full text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight">{user.username}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500 dark:text-gray-400 mt-2 font-medium">
                <span className="text-blue-600">@{user.username.replace(/\s+/g, '_').toLowerCase()}</span>
                {user.profile?.location && <span className="flex items-center gap-1"><MapPin size={16} /> {user.profile.location}</span>}
              </div>
              {isArtist && (
                <div className="flex items-center justify-center md:justify-start gap-6 mt-4">
                  <StatItem icon={Users} value={followersCount} label="Followers" color="text-blue-600" />
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 hidden md:block"></div>
                  <StatItem icon={Users} value={followingCount} label="Following" color="text-green-600" />
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 hidden md:block"></div>
                  <StatItem icon={ShoppingBag} value={gallery.length || "0"} label="Artworks" color="text-purple-600" />
                </div>
              )}
            </div>

<div className="flex gap-2 w-full md:w-auto justify-center md:justify-start flex-wrap">
  
                {isOwner ? (
                <>
                  <button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-200"><Edit3 size={18} /> Edit Profile</button>
                  <button className="p-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"><Settings size={20} /></button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleFollowToggle}
                    className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors ${isFollowing ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'}`}
                  >
                    {isFollowing ? 'Following' : 'Follow Artist'}
                  </button>
                  <button onClick={() => setShowCommissionForm(true)} className="px-4 sm:px-6 py-2 bg-black dark:bg-white dark:text-black text-white font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 shadow-lg">
                    Hire Artist
                  </button>
                </>
              )}
<button className="px-4 py-2.5 border rounded-xl text-sm flex items-center justify-center" onClick={handleShare}>
  <Share2 size={16} />
</button>            </div>
          </div>

          <div className="flex gap-8 border-b border-gray-200 dark:border-gray-700 mt-8 overflow-x-auto no-scrollbar">
            {isArtist ? (
              <>
                <TabButton active={activeTab} name="gallery" label="Gallery" onClick={setActiveTab} />
                <TabButton active={activeTab} name="blogs" label="Blogs" onClick={setActiveTab} />
                <TabButton active={activeTab} name="about" label="About" onClick={setActiveTab} />
                {isOwner && (<TabButton active={activeTab} name="orders" label="Orders" onClick={(name) => { setActiveTab(name); fetchOrders(); }} />)}
                {isOwner && (<TabButton active={activeTab} name="dashboard" label="Dashboard" onClick={setActiveTab} />)}
              </>
            ) : (
              <>
                <TabButton active={activeTab} name="liked" label="Liked Art" onClick={setActiveTab} />
                <TabButton active={activeTab} name="orders" label="My Orders" onClick={(name) => { setActiveTab(name); fetchOrders(); }} />
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
                {isArtist && isOwner && (
                  <div onClick={() => setIsAddingArt(true)} className="break-inside-avoid aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors mb-4">
                    <Plus size={32} className="text-gray-400 mb-2" />
                    <span className="font-bold text-gray-500 dark:text-gray-400">Add Art</span>
                  </div>
                )}
                {gallery.map((art) => (
                  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={art._id} onClick={() => openArtwork(art)}
                    className="break-inside-avoid bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative mb-4"
                  >
                    <img src={art.images[0]} className="w-full h-auto object-cover" alt={art.title} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold">
                      <span className="flex items-center gap-1"><Heart size={16} fill="white" /> {art.stats?.likes || 0}</span>
                      <span className="flex items-center gap-1"><Eye size={16} /> {art.stats?.views || 0}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'blogs' && (
            <motion.div key="blogs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isArtist && (
                <div onClick={() => setIsAddingBlog(true)} className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors bg-white dark:bg-gray-800 min-h-[250px]">
                  <BookOpen size={32} className="text-gray-400 mb-2" />
                  <span className="font-bold text-gray-500 dark:text-gray-400 mt-2">Write a Story</span>
                </div>
              )}
              {blogs.map(blog => (
                <div key={blog._id} onClick={() => setSelectedBlog(blog)}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col min-h-[250px] cursor-pointer group"
                >
                  <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-xl mb-4 overflow-hidden relative">
                    {blog.coverImage
                      ? <img src={blog.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Cover" />
                      : <div className="w-full h-full flex items-center justify-center text-gray-400">No Cover</div>
                    }
                  </div>
                  <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">{blog.title}</h2>
                  <div className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 overflow-hidden flex-1" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }} />
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span className="text-blue-600 font-bold text-sm">Read Story →</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Bio</h3>
                <p className="text-gray-600 dark:text-gray-400">{user.profile?.bio || "No bio yet."}</p>
              </div>
              {isArtist && (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Artist Reviews</h3>
                  <ReviewSection targetType="artist" targetId={user._id} currentUser={JSON.parse(localStorage.getItem('user'))} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'liked' && (
            <div className="w-full">
              {likedArtworks.length === 0 ? (
                <EmptyState icon={Heart} title="No Liked Art" desc="Explore the gallery and like some artworks." />
              ) : (
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                  {likedArtworks.map((art) => (
                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={art._id}
                      onClick={() => openArtwork(art)}
                      className="break-inside-avoid bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative mb-4"
                    >
                      <img src={art.images[0]} className="w-full h-auto object-cover" alt={art.title} />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold">
                        <span className="flex items-center gap-1"><Heart size={16} fill="white" /> {art.stats?.likes || 0}</span>
                        <span className="flex items-center gap-1"><Eye size={16} /> {art.stats?.views || 0}</span>
                      </div>
                      <div className="p-3 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{art.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">by {art.artist?.username}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && isOwner && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">No orders yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                          <img src={order.artwork?.images?.[0]} className="w-full h-full object-cover" alt={order.artwork?.title} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{order.artwork?.title || 'Artwork'}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">₹{order.amount}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${order.status === 'paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : order.status === 'failed' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'}`}>
                          {order.status}
                        </span>
                        {order.shippingAddress?.city && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">Ships to {order.shippingAddress.city}, {order.shippingAddress.state}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'dashboard' && isOwner && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Commissions</h2>
              {commissions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">No commission requests yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {commissions.map((comm) => {
                    const isArtistRole = comm.artist._id === user._id;
                    const otherPerson = isArtistRole ? comm.buyer : comm.artist;
                    return (
                      <div key={comm._id} onClick={() => setSelectedCommission(comm)}
                        className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <img src={otherPerson?.profile?.avatar_url || `https://ui-avatars.com/api/?name=${otherPerson?.username}&background=random`} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-900 dark:text-white">
                                {isArtistRole ? `Request from ${otherPerson?.username}` : `Sent to ${otherPerson?.username}`}
                              </h4>
                              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${comm.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                  comm.status === 'accepted' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                    comm.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                }`}>
                                {comm.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{comm.description}</p>
                            <div className="flex gap-4 mt-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1"><IndianRupee size={14} /> {comm.budget}</span>
                              <span className="flex items-center gap-1"><Calendar size={14} /> Due: {new Date(comm.deadline).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        {isArtistRole && comm.status === 'pending' && (
                          <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={(e) => handleUpdateStatus(comm._id, 'accepted', e)} className="flex-1 md:flex-none px-4 py-2 bg-black dark:bg-white dark:text-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100">Accept</button>
                            <button onClick={(e) => handleUpdateStatus(comm._id, 'rejected', e)} className="flex-1 md:flex-none px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">Decline</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

const StatItem = ({ icon: Icon, value, label, color }) => (
  <div className="flex items-center gap-2">
    <Icon size={20} className={color} />
    <span className="font-bold text-sm sm:text-lg">{value}</span> 
    <span className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase hidden sm:block">{label}</span>
  </div>
);

const TabButton = ({ active, name, label, onClick }) => (
  <button onClick={() => onClick(name)}
    className={`pb-4 text-sm font-bold uppercase relative ${active === name ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}>
    {label}
    {active === name && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
  </button>
);

const EmptyState = ({ icon: Icon, title, desc }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl bg-white dark:bg-gray-800">
    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 mb-4">
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
  </div>
);

// const DashboardCard = ({ title, count, icon: Icon, color }) => (
//   <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between transition-transform hover:-translate-y-1">
//     <div>
//       <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase mb-1">{title}</p>
//       <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{count}</h3>
//     </div>
//     <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
//       <Icon size={24} />
//     </div>
//   </div>
// );

const AddBlogModal = ({ close, save, uploadImage }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const quillRef = useRef(null);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const imageUrl = await uploadImage(file);
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', imageUrl);
        } catch (error) {
          alert('Image upload failed');
        }
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !coverFile) return alert("Title, content, and cover image are required.");

    setLoading(true);
    try {
      const coverImageUrl = await uploadImage(coverFile);
      const cleanContent = DOMPurify.sanitize(content);

      await save({ title, coverImage: coverImageUrl, content: cleanContent });
    } catch (error) {
      alert("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-900 w-full max-w-4xl h-[85vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">

        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold dark:text-white">Write a Story</h2>
          <button onClick={close} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><X size={20} className="dark:text-gray-300" /></button>
        </div>

        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          <div className="mb-6 flex items-center gap-4">
            <div
              onClick={() => document.getElementById('blog-cover').click()}
              className="w-40 h-24 bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer overflow-hidden hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {coverPreview
                ? <img src={coverPreview} className="w-full h-full object-cover" />
                : <span className="text-xs font-bold text-gray-500 dark:text-gray-400">+ Add Cover</span>
              }
            </div>
            <input id="blog-cover" type="file" className="hidden" accept="image/*" onChange={(e) => {
              setCoverFile(e.target.files[0]);
              setCoverPreview(URL.createObjectURL(e.target.files[0]));
            }} />
            <p className="text-sm text-gray-400 dark:text-gray-500">This image will appear on the blog card.</p>
          </div>

          <input
            type="text"
            placeholder="Catchy Blog Title..."
            className="w-full text-3xl font-bold mb-6 outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 bg-transparent dark:text-white"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <div className="flex-1 overflow-y-auto pb-10 border border-gray-200 dark:border-gray-700 rounded-xl">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              className="h-full dark:text-white"
              placeholder="Tell your creative process..."
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end bg-white dark:bg-gray-900">
          <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "Publish Story"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ReadBlogModal = ({ blog, close, user }) => {
  if (!blog) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={close}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 w-full max-w-5xl h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden relative"
      >
        <button onClick={close} className="absolute top-4 right-4 z-10 p-3 bg-white/50 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-md rounded-full shadow-sm transition-all">
          <X size={20} className="text-gray-900 dark:text-white" />
        </button>
        <div className="flex-1 overflow-y-auto pb-20">
          {blog.coverImage && (
            <div className="w-full h-64 md:h-80 bg-gray-100 dark:bg-gray-800 relative">
              <img src={blog.coverImage} className="w-full h-full object-cover" alt="Blog Cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          )}
          <div className="px-8 md:px-16 pt-10">
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">{blog.title}</h1>
              <div className="flex items-center gap-4 border-y border-gray-100 dark:border-gray-700 py-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img src={user?.profile?.avatar_url} className="w-full h-full object-cover" alt="Author" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{user?.username || "The Artist"}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(blog.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div
              className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed break-words whitespace-pre-wrap overflow-x-hidden w-full"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;