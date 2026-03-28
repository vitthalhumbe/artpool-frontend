import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import axios from 'axios';
import socket from '../socket';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const NotificationBell = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!currentUser) return;
    fetchNotifications();

    socket.connect();
    socket.emit('user_connected', currentUser._id);
    socket.on('new_notification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
    });

    return () => { socket.off('new_notification'); socket.disconnect(); };
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API}/api/notifications/${currentUser._id}`);
      setNotifications(res.data);
    } catch (err) { console.error(err); }
  };

  const handleOpen = async () => {
    setOpen(!open);
    if (!open && unread > 0) {
      await axios.put(`${API}/api/notifications/${currentUser._id}/read`);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  return (
    <div className="relative">
      <button onClick={handleOpen} className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
        <Bell size={22} className="text-gray-600" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100 font-bold text-gray-900">Notifications</div>
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">No notifications yet.</div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map(n => (
                <div key={n._id} className={`flex items-start gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}>
                  <img src={n.sender?.profile?.avatar_url} className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt="" />
                  <div>
                    <p className="text-sm text-gray-800">
                      <span className="font-bold">{n.sender?.username}</span> {n.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;