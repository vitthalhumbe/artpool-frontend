import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import LoginImage from '../assets/image.png';
import { GoogleLogin } from '@react-oauth/google';

const LOGIN_IMAGE = LoginImage;

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
      const response = await api.post('/api/auth/login', {
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
    <div className="h-[calc(100vh-80px)] flex overflow-hidden w-full bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-1/2 h-screen relative bg-gray-900 hidden md:block"
      >
        <img src={LOGIN_IMAGE} alt="Art Gallery" className="w-full h-screen object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-16 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h3 className="text-4xl font-bold mb-4">Welcome back to the community.</h3>
            <p className="text-gray-300 text-xl max-w-lg leading-relaxed">Continue your journey through the world's most exclusive collection of deliverable art.</p>
            <div className="w-16 h-1 bg-blue-500 mt-8 rounded-full"></div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 h-full flex flex-col justify-center items-center bg-white dark:bg-gray-900 p-8 md:p-16 relative"
      >
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-4xl font-bold mb-3 tracking-tight dark:text-white">Welcome back.</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Enter your details to access your account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. alex@example.com"
                  className="w-full pl-12 pr-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-blue-600 hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl font-medium">{error}</div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 ">
              {loading ? <Loader2 className="animate-spin" /> : "Log In"}
            </button>

            <div className="flex items-center gap-3 my-2">
  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
  <span className="text-xs text-gray-400 font-medium">or</span>
  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
</div>
<button
  type="button"
  onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`}
  className="w-full py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-3 transition-colors"
>
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
  Continue with Google
</button>
          </form>

          <p className="mt-8 text-center text-gray-500 dark:text-gray-400">
            New to ArtPool? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Create an account.</Link>
          </p>
        </div>

        <div className="absolute bottom-8 text-xs text-gray-400">© 2026 ArtPool Inc. • Privacy • Terms</div>
      </motion.div>
    </div>
  );
};

export default Login;