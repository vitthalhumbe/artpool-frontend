import { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import socket from '../socket';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ChatWindow = ({ currentUser, otherUser, close }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    socket.on('receive_message', (msg) => {
      if (msg.sender._id === otherUser._id || msg.sender === otherUser._id) {
        setMessages(prev => [...prev, msg]);
      }
    });
    return () => socket.off('receive_message');
  }, [otherUser._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/api/messages/${currentUser._id}/${otherUser._id}`);
      setMessages(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const sendMessage = () => {
    if (!text.trim()) return;
    const optimistic = {
      _id: Date.now(),
      sender: { _id: currentUser._id },
      text,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, optimistic]);
    socket.emit('send_message', {
      senderId: currentUser._id,
      receiverId: otherUser._id,
      text
    });
    setText('');
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-[200]">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <img src={otherUser.profile?.avatar_url} className="w-8 h-8 rounded-full object-cover" alt="" />
          <span className="font-bold text-sm text-gray-900">{otherUser.username}</span>
        </div>
        <button onClick={close} className="p-1 hover:bg-gray-200 rounded-full"><X size={16} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center pt-8"><Loader2 className="animate-spin text-gray-400" size={20} /></div>
        ) : messages.map(msg => {
          const isMine = (msg.sender._id || msg.sender) === currentUser._id;
          return (
            <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${isMine ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'}`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-gray-100 flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 text-sm bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={sendMessage} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;