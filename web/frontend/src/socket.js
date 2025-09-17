import { io } from 'socket.io-client';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Create a singleton Socket.IO client instance
const socket = io(BACKEND_URL, {
  transports: ['websocket'],
  withCredentials: true
});

export default socket;
