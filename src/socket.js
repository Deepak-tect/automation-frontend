import { io } from 'socket.io-client';

const socket = io('http://localhost:4000'); // use your backend URL in production
export default socket;
