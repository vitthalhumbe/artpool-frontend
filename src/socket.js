import { io } from 'socket.io-client';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const socket = io(API, { autoConnect: false });

export default socket;