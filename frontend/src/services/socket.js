import { io } from "socket.io-client";

// Sockets can't ride the Vite dev proxy / Vercel rewrite used by axios (see
// api.js), so we connect straight to the backend origin. In dev that's
// always localhost:5000; in prod it's derived from VITE_API_URL.
const SOCKET_URL = import.meta.env.DEV
  ? "http://localhost:8000"
  : (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "") || window.location.origin;

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
    });
  }

  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect();
};
