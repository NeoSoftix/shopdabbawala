import { io } from "socket.io-client";
import API from "./api";

// Sockets can't ride the Vite dev proxy / Vercel rewrite used by axios (see
// api.js), so we connect straight to the backend origin. In dev that's
// always localhost:8000; in prod it's derived from VITE_API_URL.
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

    // socket.io-client auto-reconnects on drops but reuses whatever `auth`
    // was set at the time - refresh it here so a reconnect after the 1h
    // socket token expiry (long-lived tab, laptop sleep, etc.) re-authenticates
    // instead of failing silently.
    socket.io.on("reconnect_attempt", async () => {
      try {
        const { data } = await API.get("/auth/socket-token");
        if (data?.token) socket.auth = { token: data.token };
      } catch (error) {
        console.error("socket reconnect: failed to refresh socket token", error);
      }
    });
  }

  return socket;
};

// The socket connects to a different origin than the page (see SOCKET_URL
// above), so its handshake can't rely on the httpOnly `token` cookie -
// browsers that block/partition third-party cookies (Safari, Firefox, and a
// growing share of Chrome) drop it even with SameSite=None; Secure set. We
// fetch a short-lived token over the (same-origin, cookie-reliable) REST
// API instead and pass it explicitly in the handshake `auth` payload.
export const connectSocket = async () => {
  const s = getSocket();
  if (s.connected) return s;

  try {
    const { data } = await API.get("/auth/socket-token");
    if (data?.token) s.auth = { token: data.token };
  } catch (error) {
    console.error("connectSocket: failed to fetch socket token", error);
  }

  s.connect();
  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect();
};
