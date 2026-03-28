import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import ChatWindow from './components/ChatWindow';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!currentUser) return;
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${API}/api/messages/conversations/${currentUser._id}`);
      setConversations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return <div className="min-h-screen flex items-center justify-center text-gray-400">Please log in.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl">
            <p className="font-medium">No conversations yet.</p>
            <p className="text-sm mt-1">Start a chat from any artwork page.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => (
              <div
                key={conv.other._id}
                onClick={() => setActiveChat(conv.other)}
                className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center gap-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
              >
                <img src={conv.other.profile?.avatar_url} className="w-12 h-12 rounded-full object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900">{conv.other.username}</h4>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{new Date(conv.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeChat && (
        <ChatWindow
          currentUser={currentUser}
          otherUser={activeChat}
          close={() => setActiveChat(null)}
        />
      )}
    </div>
  );
};

export default Messages;