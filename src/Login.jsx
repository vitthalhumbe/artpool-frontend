import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const LOGIN_IMAGE = "https://images.unsplash.com/photo-1545989253-02cc26577f88?q=80&w=2000&auto=format&fit=crop";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));

      console.log("Logged In as:", response.data.role);

      navigate('/');
      
    } catch (err) {
      console.error("Login Failed:", err.response?.data?.message);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-white overflow-hidden flex font-sans text-gray-900">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-1/2 h-full relative bg-gray-900 hidden md:block"
      >
        <img 
          src={LOGIN_IMAGE} 
          alt="Art Gallery"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-4xl font-bold mb-4">Welcome back to the community.</h3>
            <p className="text-gray-300 text-xl max-w-lg leading-relaxed">
              Continue your journey through the world's most exclusive collection of deliverable art.
            </p>
            <div className="w-16 h-1 bg-blue-500 mt-8 rounded-full"></div>
          </motion.div>
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 h-full flex flex-col justify-center items-center bg-white p-8 md:p-16 relative"
      >
          <div className="absolute top-8 left-8 md:left-12 cursor-pointer flex items-center gap-2" onClick={() => navigate('/')}>
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
             <span className="text-2xl font-bold tracking-tight">ArtPool</span>
          </div>

          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-4xl font-bold mb-3 tracking-tight">Welcome back.</h2>
              <p className="text-gray-500 text-lg">Enter your details to access your account.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. alex@example.com"
                    className="w-full pl-12 pr-5 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                    required
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Password</label>
                   <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Forgot Password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl font-medium flex items-center gap-2">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Log In"}
              </button>
            </form>

            <p className="mt-8 text-center text-gray-500">
              New to ArtPool? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Create an account.</Link>
            </p>
          </div>

          <div className="absolute bottom-8 text-xs text-gray-400">
             © 2026 ArtPool Inc. • Privacy • Terms
          </div>

      </motion.div>
    </div>
  );
};

export default Login;