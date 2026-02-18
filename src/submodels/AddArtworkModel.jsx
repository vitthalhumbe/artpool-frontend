
import  { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Image as ImageIcon } from 'lucide-react';

const AddArtworkModal = ({ close, save, uploadImage }) => {
  const [form, setForm] = useState({ 
    title: '', 
    price: '', 
    description: '', 
    category: 'Painting', 
    tags: '' 
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };
  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (imageFiles.length === 0 || !form.title || !form.price) return alert("Please fill required fields");
    
    setLoading(true);
    try {
      const uploadPromises = imageFiles.map(file => uploadImage(file));
      const imageUrls = await Promise.all(uploadPromises);
      
      const formattedTags = form.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
      await save({ 
        ...form, 
        images: imageUrls,
        tags: formattedTags 
      });
      
    } catch (e) {
      console.error(e);
      alert("Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add New Artwork</h2>
          <button onClick={close}><X size={24} className="text-gray-400 hover:text-gray-600"/></button>
        </div>

        <div className="space-y-4">
          
          <div className="space-y-3">
             <div onClick={() => document.getElementById('art-upload').click()} className="p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                <ImageIcon size={32} className="text-gray-400 mb-2"/>
                <span className="text-sm text-gray-500 font-medium">Click to upload images (Max 5)</span>
                <input id="art-upload" type="file" multiple className="hidden" accept="image/*" onChange={handleFiles} />
             </div>
             {previews.length > 0 && (
               <div className="grid grid-cols-4 gap-2">
                 {previews.map((src, idx) => (
                   <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={src} className="w-full h-full object-cover" alt="preview" />
                      <button 
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                   </div>
                 ))}
               </div>
             )}
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
               <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
               <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
               <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-white">
                 <option>Painting</option><option>Sketch</option><option>Digital</option><option>Sculpture</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Tags</label>
               <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="Nature, Oil" />
             </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} className="w-full mt-8 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 flex justify-center items-center gap-2">
          {loading ? <Loader2 className="animate-spin"/> : "Publish Artwork"}
        </button>
      </motion.div>
    </div>
  );
};

export default AddArtworkModal;