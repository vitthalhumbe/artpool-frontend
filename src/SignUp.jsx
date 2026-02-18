import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, User, Camera, ArrowRight, Check , Loader2} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Img from "./assets/hero.jpg"
import axios from 'axios';
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
        const response = await axios.post("http://localhost:5000/api/auth/register", {
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

      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, 
        data
      );

      const imageUrl = cloudinaryRes.data.secure_url;
      console.log("Image Uploaded:", imageUrl);
      const user = JSON.parse(localStorage.getItem('user'));
      
      await axios.put("http://localhost:5000/api/auth/update-avatar", {
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
    <div className="h-screen w-full bg-white overflow-hidden flex font-sans text-gray-900">
      <motion.div 
        layout
        transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }} 
        className={`w-full h-full flex ${
          step === 1 ? 'flex-row' : 'flex-row-reverse'
        }`}
      >
        <motion.div 
          layout 
          className="w-1/2 relative bg-gray-900 overflow-hidden hidden md:block"
        >
          <motion.img 
            src={Img} 
            alt="Workspace"
            className="w-full h-full object-cover opacity-80"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-12 text-white">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-3xl font-bold mb-2">
                {step === 1 ? "Join 10,000+ creators." : "Showcase your work."}
              </h3>
              <p className="text-gray-300 text-lg">
                {step === 1 
                  ? "The premier marketplace for tangible, deliverable art."
                  : "Complete your profile to start selling immediately."}
              </p>
            </motion.div>
          </div>
        </motion.div>
        <motion.div 
          layout 
          className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-white"
        >
          
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md mx-auto"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Join ArtPool.</h2>
                  <p className="text-gray-500">Start your journey as a Creator or Collector.</p>
                </div>

                <div className="flex gap-4 mb-8">
                  <RoleCard 
                    selected={role === 'artist'} 
                    onClick={() => setRole('artist')}
                    icon={Palette}
                    title="Artist"
                    desc="I want to sell art"
                  />
                  <RoleCard 
                    selected={role === 'customer'} 
                    onClick={() => setRole('customer')}
                    icon={User}
                    title="Customer"
                    desc="I want to buy art"
                  />
                </div>

                <div className="space-y-5">
                  <InputGroup label="Full Name" name="fullName" placeholder="e.g. Vitthal Humbe" value={formData.fullName} onChange={handleChange} />
                  <InputGroup label="Email Address" name="email" type="email" placeholder="name@domain.com" value={formData.email} onChange={handleChange} />
                  <InputGroup label="Password" name="password" type="password" placeholder="Minimum 8 characters" value={formData.password} onChange={handleChange} />
                </div>
                
                {error && <p className="text-red-500 text-sm mt-4 font-medium">{error}</p>}
                <button 
                  onClick={handleRegistration} 
  disabled={loading}
                  className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group"
                >{loading ? (
    <Loader2 className="animate-spin" />
  ) : (
    <>
      Continue
      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
    </>
  )}</button>

                <p className="mt-6 text-center text-sm text-gray-500">
                  Already have an account? <a onClick={() => navigate('/login')} className="text-blue-600 font-semibold hover:underline">Log in</a>
                </p>
              </motion.div>
            )}

           {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="w-full max-w-md mx-auto text-center"
              >
                <div className="mb-10">
                  <h2 className="text-4xl font-bold mb-3">Welcome, {formData.fullName.split(' ')[0]}!</h2>
                  <p className="text-gray-500">Let's put a face to the name.</p>
                </div>
                <input 
                  type="file" 
                  id="fileInput" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div 
                  className="border-3 border-dashed border-gray-200 rounded-3xl p-10 mb-8 cursor-pointer hover:border-blue-400 hover:bg-gray-50 transition-all relative overflow-hidden"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                   {previewUrl ? (
                     <img src={previewUrl} alt="Preview" className="w-32 h-32 rounded-full object-cover mx-auto shadow-md" />
                   ) : (
                     <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera size={40} />
                     </div>
                   )}
                   
                   <p className="text-lg font-medium text-gray-900 mt-4">
                     {previewUrl ? "Click to Change" : <span>Drag & Drop or <span className="text-blue-600">Click to Upload</span></span>}
                   </p>
                </div>

                <button 
                  onClick={handleImageUpload}
                  disabled={uploading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-200 flex justify-center items-center gap-2"
                >
                  {uploading ? <Loader2 className="animate-spin" /> : "Save & Continue"}
                </button>
                
                <button onClick={() => navigate('/')} className="mt-4 text-gray-400 font-medium text-sm hover:text-gray-600">
                  Skip for now
                </button>
              </motion.div>
            )}

          </AnimatePresence>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200'}`} />
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200'}`} />
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
        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' 
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
    }`}
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${selected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
      <Icon size={20} />
    </div>
    <div className="font-bold text-gray-900">{title}</div>
    <div className="text-xs text-gray-500">{desc}</div>
    
    {selected && <div className="absolute top-2 right-2 text-blue-600"><Check size={16} /></div>}
  </div>
);

const InputGroup = ({ label, name, type = "text", placeholder, value, onChange }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-300 font-medium"
    />
  </div>
);

export default Signup;