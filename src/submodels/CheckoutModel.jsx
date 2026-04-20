import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, MapPin } from 'lucide-react';
import api from '../utils/api';


const CheckoutModal = ({ artwork, currentUser, close, onSuccess }) => {
    const [step, setStep] = useState(1); // 1 = address, 2 = paying
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState({
        name: '', phone: '', line1: '', city: '', state: '', pincode: ''
    });

    const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

    const handlePay = async () => {
        if (!address.name || !address.phone || !address.line1 || !address.city || !address.pincode) {
            return alert("Please fill all address fields.");
        }

        setLoading(true);
        try {
            // Mock: directly create a paid order on backend
            await api.post(`/api/orders/create`, {
                amount: artwork.price,
                artworkId: artwork._id,
                buyerId: currentUser._id,
                shippingAddress: address,
            });

            setTimeout(() => {
                setLoading(false);
                onSuccess();
                close();
            }, 1500); // Fake 1.5s payment processing delay
        } catch (error) {
            alert("Order failed. Try again.");
            setLoading(false);
        }
    };

    return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={close}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
          <div>
            <h2 className="text-xl font-bold dark:text-white">Buy Original</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{artwork.title} — ₹{artwork.price}</p>
          </div>
          <button onClick={close} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><X size={20} className="dark:text-gray-300" /></button>
        </div>

        <div className="mx-6 mt-4 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-xs font-medium text-yellow-700 dark:text-yellow-400">
          Payments are in demo mode. No real money will be charged.
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={16} className="text-blue-600" />
            <span className="font-bold text-gray-800 dark:text-gray-200">Shipping Address</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input name="name" placeholder="Full Name" value={address.name} onChange={handleChange}
              className="col-span-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            <input name="phone" placeholder="Phone Number" value={address.phone} onChange={handleChange}
              className="col-span-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            <input name="line1" placeholder="Address Line" value={address.line1} onChange={handleChange}
              className="col-span-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            <input name="city" placeholder="City" value={address.city} onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            <input name="pincode" placeholder="Pincode" value={address.pincode} onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            <input name="state" placeholder="State" value={address.state} onChange={handleChange}
              className="col-span-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full mt-4 py-4 bg-black dark:bg-white dark:text-black text-white font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" /> : `Pay ₹${artwork.price}`}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutModal;