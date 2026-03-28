import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-extrabold text-gray-100">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 -mt-6 mb-4">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-4">
        <button onClick={() => navigate(-1)} className="px-6 py-3 border border-gray-200 rounded-full font-bold text-gray-700 hover:border-gray-400 transition-colors">Go Back</button>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors">Go Home</button>
      </div>
    </div>
  );
};

export default NotFound;