import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, MessageSquare } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NotificationBell from './components/NotificationBell';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    else setUser(null);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tight">ArtPool</Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            <Link to="/artists" className="text-gray-600 hover:text-gray-900 font-medium">Artists</Link>
            <Link to="/gallery" className="text-gray-600 hover:text-gray-900 font-medium">Gallery</Link>
            <Link to="/commission" className="text-gray-600 hover:text-gray-900 font-medium">Commission</Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 font-medium">About</Link>
            <Link to="/faq" className="text-gray-600 hover:text-gray-900 font-medium">FAQ</Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium text-sm">Hello, {user.username.split(' ')[0]}</span>
                <NotificationBell currentUser={user} />
                <button onClick={() => navigate('/messages')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MessageSquare size={22} className="text-gray-600" />
                </button>
                <div
                  className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                  onClick={() => navigate('/profile')}
                >
                  {user.profile?.avatar_url
                    ? <img src={user.profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-500"><User size={20} /></div>
                  }
                </div>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition-colors"><LogOut size={20} /></button>
              </div>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-gray-600 hover:text-gray-900 font-medium">Log in</button>
                <button onClick={() => navigate('/signup')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors">Create Account</button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-6 space-y-4">
          <Link to="/artists" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 font-medium py-2">Artists</Link>
          <Link to="/gallery" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 font-medium py-2">Gallery</Link>
          <Link to="/commission" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 font-medium py-2">Commission</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 font-medium py-2">About</Link>
          <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 font-medium py-2">FAQ</Link>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 font-medium py-2">Profile</Link>
              <Link to="/messages" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 font-medium py-2">Messages</Link>
              <button onClick={handleLogout} className="block text-red-500 font-medium py-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 font-medium py-2">Log in</Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-full font-medium">Create Account</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;