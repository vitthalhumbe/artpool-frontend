import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Calendar, IndianRupee, CheckCircle, Image as ImageIcon, ArrowLeftRight } from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const CommissionModal = ({ artist, currentUser, close, existingCommission, onUpdate }) => {
  const { toast } = useToast();
  const isNegotiating = !!existingCommission;

  const [formData, setFormData] = useState({
    description: existingCommission?.description || '',
    budget: existingCommission?.budget || '',
    deadline: existingCommission?.deadline ? new Date(existingCommission.deadline).toISOString().split('T')[0] : ''
  });
  const [referenceFiles, setReferenceFiles] = useState([]);
  const [negotiateMsg, setNegotiateMsg] = useState('');
  const [negotiateBudget, setNegotiateBudget] = useState('');
  const [negotiateDeadline, setNegotiateDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tab, setTab] = useState('details'); // 'details' | 'negotiate'

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setReferenceFiles(prev => [...prev, ...files.map(file => ({ file, preview: URL.createObjectURL(file) }))]);
    }
  };

  const removeFile = (idx) => setReferenceFiles(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (!formData.description || !formData.budget || !formData.deadline) {
      return toast({ message: 'Please fill out all fields.', type: 'warning' });
    }
    setLoading(true);
    try {
      const uploadedImageUrls = [];
      for (const item of referenceFiles) {
        const uploadData = new FormData();
        uploadData.append('file', item.file);
        uploadData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET);
        const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, {
          method: 'POST', body: uploadData
        });
        const cloudData = await cloudRes.json();
        uploadedImageUrls.push(cloudData.secure_url);
      }
      await api.post('/api/commissions', {
        artistId: artist._id || artist,
        buyerId: currentUser._id,
        referenceImages: uploadedImageUrls,
        description: formData.description,
        budget: Number(formData.budget),
        deadline: formData.deadline
      });
      setSuccess(true);
    } catch (error) {
      toast({ message: 'Failed to send request.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleNegotiate = async () => {
    if (!negotiateMsg && !negotiateBudget && !negotiateDeadline) {
      return toast({ message: 'Propose at least one change.', type: 'warning' });
    }
    setLoading(true);
    try {
      const res = await api.post(`/api/commissions/${existingCommission._id}/negotiate`, {
        proposedBy: currentUser._id,
        budget: negotiateBudget ? Number(negotiateBudget) : undefined,
        deadline: negotiateDeadline || undefined,
        message: negotiateMsg
      });
      toast({ message: 'Counter-proposal sent!', type: 'success' });
      if (onUpdate) onUpdate(res.data);
      close();
    } catch (error) {
      toast({ message: 'Failed to send proposal.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={close}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isNegotiating ? 'Negotiate Commission' : `Hire ${artist?.username || 'Artist'}`}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isNegotiating ? 'Propose new terms or counter-offer' : 'Send a custom commission request'}
            </p>
          </div>
          <button onClick={close} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X size={20} className="dark:text-gray-300" />
          </button>
        </div>

        {success ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <CheckCircle size={64} className="text-green-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Request Sent!</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8">The artist will review your request and get back to you soon.</p>
            <button onClick={close} className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 w-full">Close</button>
          </div>
        ) : (
          <>
            {isNegotiating && (
              <div className="flex border-b border-gray-100 dark:border-gray-700">
                <button onClick={() => setTab('details')} className={`flex-1 py-3 text-sm font-bold transition-colors ${tab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>
                  Current Details
                </button>
                <button onClick={() => setTab('negotiate')} className={`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-1 ${tab === 'negotiate' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>
                  <ArrowLeftRight size={14} /> Counter-Propose
                </button>
                <button onClick={() => setTab('history')} className={`flex-1 py-3 text-sm font-bold transition-colors ${tab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>
                  History
                </button>
              </div>
            )}

            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">

              {/* New Commission Form */}
              {!isNegotiating && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Reference Images (Optional)</label>
                    {referenceFiles.length > 0 && (
                      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                        {referenceFiles.map((item, idx) => (
                          <div key={idx} className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img src={item.preview} className="w-full h-full object-cover" alt="Preview" />
                            <button onClick={() => removeFile(idx)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"><X size={12} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                      <ImageIcon size={18} />
                      <span className="text-sm font-medium">Upload References</span>
                      <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Project Description</label>
                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe what you want the artist to create..." rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Budget</label>
                      <div className="relative">
                        <IndianRupee size={16} className="absolute left-3 top-3.5 text-gray-400" />
                        <input type="number" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} placeholder="e.g. 5000"
                          className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-3.5 text-gray-400" />
                        <input type="date" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                          className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  <button onClick={handleSubmit} disabled={loading} className="w-full py-4 bg-black dark:bg-white dark:text-black text-white font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors shadow-lg">
                    {loading ? <Loader2 className="animate-spin" /> : 'Send Commission Request'}
                  </button>
                </>
              )}

              {/* Current Details Tab */}
              {isNegotiating && tab === 'details' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description</p>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{existingCommission.description}</div>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Budget</p>
                      <p className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center"><IndianRupee size={18} />{existingCommission.budget}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Deadline</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(existingCommission.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {existingCommission.referenceImages?.length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Reference Images</p>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {existingCommission.referenceImages.map((img, idx) => (
                          <div key={idx} onClick={() => window.open(img, '_blank')} className="w-20 h-20 rounded-xl overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 hover:ring-2 hover:ring-blue-500 flex-shrink-0">
                            <img src={img} alt="Ref" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Negotiate Tab */}
              {isNegotiating && tab === 'negotiate' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Propose changes to budget, deadline, or leave a message. Leave fields blank to keep current values.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">New Budget (₹)</label>
                      <div className="relative">
                        <IndianRupee size={16} className="absolute left-3 top-3.5 text-gray-400" />
                        <input type="number" value={negotiateBudget} onChange={e => setNegotiateBudget(e.target.value)}
                          placeholder={existingCommission.budget}
                          className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">New Deadline</label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-3.5 text-gray-400" />
                        <input type="date" value={negotiateDeadline} onChange={e => setNegotiateDeadline(e.target.value)}
                          className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Message</label>
                    <textarea value={negotiateMsg} onChange={e => setNegotiateMsg(e.target.value)}
                      placeholder="Explain your counter-proposal..." rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <button onClick={handleNegotiate} disabled={loading} className="w-full py-4 bg-black dark:bg-white dark:text-black text-white font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors">
                    {loading ? <Loader2 className="animate-spin" /> : 'Send Counter-Proposal'}
                  </button>
                </div>
              )}

              {/* History Tab */}
              {isNegotiating && tab === 'history' && (
                <div className="space-y-3">
                  {existingCommission.negotiations?.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">No negotiations yet.</p>
                  ) : (
                    existingCommission.negotiations?.map((n, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <img src={n.proposedBy?.profile?.avatar_url} className="w-6 h-6 rounded-full object-cover" alt="" />
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{n.proposedBy?.username}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                        {n.budget && <p className="text-xs text-gray-600 dark:text-gray-400">Proposed budget: <span className="font-bold">₹{n.budget}</span></p>}
                        {n.deadline && <p className="text-xs text-gray-600 dark:text-gray-400">Proposed deadline: <span className="font-bold">{new Date(n.deadline).toLocaleDateString()}</span></p>}
                        {n.message && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 italic">"{n.message}"</p>}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default CommissionModal;
