import { io } from "socket.io-client";
import API from "./api";

// Sockets can't ride the Vite dev proxy / nginx rewrite used by axios (see
// api.js), so we connect straight to the backend origin. In dev that's
// always localhost:8000; in prod it's derived from VITE_API_URL.
const SOCKET_URL = import.meta.env.DEV
  ? "http://localhost:8001"
  : (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "") || window.location.origin;

let socket = null;

// Fetches a fresh socket token over the (same-origin, cookie-reliable) REST
// API. Passed to socket.io as an `auth` function (not a static object) below
// - socket.io-client calls this and awaits its result before EVERY single
// connection attempt, including automatic reconnects, so the handshake never
// races an in-flight token refresh against a stale/expired one.
const fetchAuthPayload = async (callback) => {
  try {
    const { data } = await API.get("/auth/socket-token");
    callback({ token: data?.token });
  } catch (error) {
    console.error("socket: failed to fetch socket token", error);
    callback({});
  }
};

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
      auth: fetchAuthPayload,
    });
  }

  return socket;
};

// The socket connects to a different origin than the page (see SOCKET_URL
// above), so its handshake can't rely on the httpOnly `token` cookie -
// browsers that block/partition third-party cookies (Safari, Firefox, and a
// growing share of Chrome) drop it even with SameSite=None; Secure set. The
// `auth` function on the socket (set in getSocket above) fetches a fresh
// token itself before connecting, so there's nothing to do here but connect.
export const connectSocket = async () => {
  const s = getSocket();
  if (s.connected) return s;

  s.connect();
  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect();
};
