import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, User, Camera, ArrowRight , Loader2} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Img from "../assets/hero.jpg"
import api from '../utils/api';
import { form } from 'framer-motion/client';
import Login from './Login';

const ART_WORKSPACE_IMG = "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2000&auto=format&fit=crop";

const Signup = () => {
    const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('artist'); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState('');

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  
  const [dragActive, setDragActive] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };
  const firstName = formData.fullName.split(' ')[0] || 'Creator';

  const handleRegistration = async () => {
    setLoading(true);
    setError('');

    try {
        const response = await api.post("/api/auth/register", {
            username: formData.fullName,
            email: formData.email,
            password: formData.password,
            role: role
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));

        setStep(2);
    } catch(err) {
        setError(err.response?.data?.message || "something went wrong");
    } finally {
        setLoading(false);
    }
  }
const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      navigate('/'); 
      return;
    }

    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", imageFile);
      
      data.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET); 
      data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

      const cloudinaryRes = await api.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, 
        data
      );

      const imageUrl = cloudinaryRes.data.secure_url;
      console.log("Image Uploaded:", imageUrl);
      const user = JSON.parse(localStorage.getItem('user'));
      
      await api.put("/api/auth/update-avatar", {
        userId: user._id, 
        avatar_url: imageUrl
      });

      navigate('/');
      
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="h-[calc(100vh-80px)] flex overflow-hidden w-full bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-white">
      <motion.div layout transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }} className={`w-full h-full flex ${step === 1 ? 'flex-row' : 'flex-row-reverse'}`}>
        <motion.div layout className="w-1/2 relative bg-gray-900 overflow-hidden hidden md:block">
          <motion.img src={Img} alt="Workspace" className="w-full h-full object-cover opacity-80" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-12 text-white">
            <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h3 className="text-3xl font-bold mb-2">{step === 1 ? "Join 10,000+ creators." : "Showcase your work."}</h3>
              <p className="text-gray-300 text-lg">{step === 1 ? "The premier marketplace for tangible, deliverable art." : "Complete your profile to start selling immediately."}</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div layout className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-white dark:bg-gray-900">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="w-full max-w-md mx-auto">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 dark:text-white">Join ArtPool.</h2>
                  <p className="text-gray-500 dark:text-gray-400">Start your journey as a Creator or Collector.</p>
                </div>
                <div className="flex gap-4 mb-8">
                  <RoleCard selected={role === 'artist'} onClick={() => setRole('artist')} icon={Palette} title="Artist" desc="I want to sell art" />
                  <RoleCard selected={role === 'customer'} onClick={() => setRole('customer')} icon={User} title="Customer" desc="I want to buy art" />
                </div>
                <div className="space-y-5">
                  <InputGroup label="Full Name" name="fullName" placeholder="e.g. Vitthal Humbe" value={formData.fullName} onChange={handleChange} />
                  <InputGroup label="Email Address" name="email" type="email" placeholder="name@domain.com" value={formData.email} onChange={handleChange} />
                  <InputGroup label="Password" name="password" type="password" placeholder="Minimum 6 characters" value={formData.password} onChange={handleChange} />
                </div>
                {error && <p className="text-red-500 dark:text-red-400 text-sm mt-4 font-medium">{error}</p>}
                <button onClick={handleRegistration} disabled={loading} className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group">
                  {loading ? <Loader2 className="animate-spin" /> : <> Continue <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> </>}
                </button>
                <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  Already have an account? <a onClick={() => navigate('/login')} className="text-blue-600 font-semibold hover:underline cursor-pointer">Log in</a>
                </p>

                <div className="flex items-center gap-3 mt-4">
  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
  <span className="text-xs text-gray-400 font-medium">or</span>
  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
</div>
<button
  type="button"
  onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`}
  className="w-full mt-3 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-3 transition-colors"
>
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
  Continue with Google
</button>
              </motion.div>
              
            )}
{console.log(import.meta.env.VITE_API_URL)}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md mx-auto text-center">
                <div className="mb-10">
                  <h2 className="text-4xl font-bold mb-3 dark:text-white">Welcome, {formData.fullName.split(' ')[0]}!</h2>
                  <p className="text-gray-500 dark:text-gray-400">Let's put a face to the name.</p>
                </div>
                <input type="file" id="fileInput" className="hidden" accept="image/*" onChange={handleFileChange} />
                <div
                  className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl p-10 mb-8 cursor-pointer hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-32 h-32 rounded-full object-cover mx-auto shadow-md" />
                  ) : (
                    <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera size={40} />
                    </div>
                  )}
                  <p className="text-lg font-medium text-gray-900 dark:text-white mt-4">
                    {previewUrl ? "Click to Change" : <span>Drag & Drop or <span className="text-blue-600">Click to Upload</span></span>}
                  </p>
                </div>
                <button onClick={handleImageUpload} disabled={uploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg flex justify-center items-center gap-2">
                  {uploading ? <Loader2 className="animate-spin" /> : "Save & Continue"}
                </button>
                <button onClick={() => navigate('/')} className="mt-4 text-gray-400 dark:text-gray-500 font-medium text-sm hover:text-gray-600 dark:hover:text-gray-300">Skip for now</button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200 dark:bg-gray-700'}`} />
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200 dark:bg-gray-700'}`} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
const RoleCard = ({ selected, onClick, icon: Icon, title, desc }) => (
  <div
    onClick={onClick}
    className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
      selected
        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 ring-1 ring-blue-600'
        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
    }`}
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${selected ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
      <Icon size={20} />
    </div>
    <div className="font-bold text-gray-900 dark:text-white">{title}</div>
    <div className="text-xs text-gray-500 dark:text-gray-400">{desc}</div>
  </div>
);

const InputGroup = ({ label, name, type = "text", placeholder, value, onChange }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
    />
  </div>
);

export default Signup;