import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Vendor from "../models/vendor.model.js";

let io = null;

const parseCookie = (cookieHeader = "", name) => {
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
};

// Vendor-only auth: verifies the same JWT cookie used by the REST API, then
// resolves the vendor doc for that user so the socket can join a private
// per-vendor room (vendor:<vendorId>) - nobody outside that vendor's own
// connections can receive events emitted to it.
const authenticateSocket = async (socket, next) => {
  try {
    const token = parseCookie(socket.handshake.headers.cookie, "token");

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id || decoded._id;

    if (!userId || decoded.role !== "vendor") {
      return next(new Error("Unauthorized"));
    }

    const vendor = await Vendor.findOne({ userId }).select("_id");

    if (!vendor) {
      return next(new Error("Unauthorized"));
    }

    socket.vendorId = vendor._id.toString();
    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
};

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (
          !origin ||
          origin.includes("localhost") ||
          origin.includes("vercel.app") ||
          origin.includes("render.com")
        ) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    socket.join(`vendor:${socket.vendorId}`);

    socket.on("disconnect", () => {
      socket.leave(`vendor:${socket.vendorId}`);
    });
  });

  return io;
};

export const emitToVendor = (vendorId, event, payload) => {
  if (!io || !vendorId) return;
  io.to(`vendor:${vendorId.toString()}`).emit(event, payload);
};
