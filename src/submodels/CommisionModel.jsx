import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Calendar, IndianRupee, CheckCircle, Upload, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

// 1. Removed referenceArtwork from props
const CommissionModal = ({ artist, currentUser, close }) => {
  const [formData, setFormData] = useState({
    description: '',
    budget: '',
    deadline: ''
  });
  
  // New state to hold uploaded files/images
  const [referenceFiles, setReferenceFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle local file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // For now, we'll store local object URLs to preview them
      const newFiles = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setReferenceFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove) => {
    setReferenceFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (!formData.description || !formData.budget || !formData.deadline) {
      return alert("Please fill out all fields so the artist knows what you want!");
    }

    setLoading(true);
    try {
      const uploadedImageUrls = []; 

      // --- THE NEW CLOUDINARY UPLOAD LOOP ---
      if (referenceFiles.length > 0) {
        for (const item of referenceFiles) {
          const uploadData = new FormData();
          uploadData.append("file", item.file);
          // REPLACE THESE WITH YOUR ACTUAL CLOUDINARY DETAILS
         uploadData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
const cloudinaryRes = await axios.post(
  `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
            uploadData
          );
          uploadedImageUrls.push(cloudinaryRes.data.secure_url);
        }
      }
      await axios.post('http://localhost:5000/api/commissions', {
        artistId: artist._id || artist,
        buyerId: currentUser._id,
        referenceImages: uploadedImageUrls, // Now this has the real secure_urls!
        description: formData.description,
        budget: Number(formData.budget),
        deadline: formData.deadline
      });
      setSuccess(true);
    } catch (error) {
      console.error("Commission request failed:", error);
      alert("Failed to send request. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={close}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        onClick={e => e.stopPropagation()} 
        className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Hire {artist?.username || "Artist"}</h2>
            <p className="text-sm text-gray-500">Send a custom commission request</p>
          </div>
          <button onClick={close} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
        </div>

        {success ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
             <CheckCircle size={64} className="text-green-500 mb-4" />
             <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
             <p className="text-gray-500 mb-8">The artist will review your request and get back to you soon.</p>
             <button onClick={close} className="px-8 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 w-full">Close</button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            
            {/* NEW: Custom Reference Image Upload */}
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Reference Images (Optional)</label>
               {referenceFiles.length > 0 && (
                 <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                   {referenceFiles.map((item, idx) => (
                     <div key={idx} className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                       <img src={item.preview} className="w-full h-full object-cover" alt="Preview" />
                       <button onClick={() => removeFile(idx)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"><X size={12}/></button>
                     </div>
                   ))}
                 </div>
               )}
               <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-colors">
                  <ImageIcon size={18} />
                  <span className="text-sm font-medium">Upload References</span>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
               </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Project Description</label>
              <textarea 
                value={formData.description} 
                onChange={e => setFormData({ ...formData, description: e.target.value })} 
                placeholder="Describe what you want the artist to create in detail..."
                rows={4} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Budget</label>
                  <div className="relative">
                     <IndianRupee size={16} className="absolute left-3 top-3.5 text-gray-400" />
                     <input 
                       type="number" 
                       value={formData.budget} 
                       onChange={e => setFormData({ ...formData, budget: e.target.value })} 
                       placeholder="e.g. 5000"
                       className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" 
                     />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Deadline</label>
                  <div className="relative">
                     <Calendar size={16} className="absolute left-3 top-3.5 text-gray-400" />
                     <input 
                       type="date" 
                       value={formData.deadline} 
                       onChange={e => setFormData({ ...formData, deadline: e.target.value })} 
                       className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 text-gray-700" 
                     />
                  </div>
               </div>
            </div>

            <button 
               onClick={handleSubmit} 
               disabled={loading} 
               className="w-full py-4 mt-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
               {loading ? <Loader2 className="animate-spin" /> : "Send Commission Request"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CommissionModal;