import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; // Your renamed original App.jsx
import Profile from './pages/Profile';
import FAQ from './pages/FAQ';
import Gallery from './pages/Gallery';
import Login from './Auth/Login';
import SignUp from './Auth/SignUp';
import Navbar from './components/Navbar'
import Messages from './pages/Messages';
import Artists from './pages/Artists';
import ResetPassword from './Auth/ResetPassword';
import ForgotPassword from './Auth/ForgotPassword';
import NotFound from './components/NotFound';
import Commission from './pages/Commission';
import AuthSuccess from './Auth/AuthSucess';
import About from './pages/About';
import Blogs from './pages/Blogs';
const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const data = params.get('data');
    if (data) {
      const user = JSON.parse(decodeURIComponent(data));
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } else {
      navigate('/login');
    }
  }, []);
  return <div className="min-h-screen flex items-center justify-center"><span className="text-gray-500">Signing you in...</span></div>;
};
const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path="/profile/:id?" element={<Profile />} />
          <Route path='/messages' element={<Messages />} />
          <Route path='/artists' element={<Artists />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />

          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/commission' element={<Commission />} />
          <Route path='/about' element={<About />} />
          <Route path='/blogs' element={<Blogs />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/auth/google/success' element={<GoogleAuthSuccess />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;