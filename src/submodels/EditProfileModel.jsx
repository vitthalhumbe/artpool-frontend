
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';


const EditProfileModal = ({ user, close, save }) => {
    const [formData, setFormData] = useState({ 
        username: user.username || "", 
        bio: user.profile?.bio || ""
    });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async () => { setSaving(true); await save(formData); setSaving(false); };
    return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Edit Profile</h2>
                <button onClick={close}><X size={20} /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Display Name</label>
                        <input value={formData.username} onChange={e => setFormData(
                            { ...formData, username: e.target.value })} 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Bio</label>
                        <textarea value={formData.bio} onChange={e => setFormData({
                             ...formData, bio: e.target.value })} 
                             rows={4} 
                             className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none" />
                    </div>
                </div>
                <div className="flex gap-3 mt-8">
                    <button onClick={close} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl">Cancel</button>
                    <button onClick={handleSubmit} disabled={saving} 
                            className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl">
                                {saving ? <Loader2 className="animate-spin" /> : "Save"}
                    </button>
                </div></motion.div></div>);
};

export default EditProfileModal;