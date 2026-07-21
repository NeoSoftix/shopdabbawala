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

// Verifies the same JWT cookie used by the REST API, then joins the socket
// to a private per-recipient room - vendors join `vendor:<vendorId>`,
// regular users join `user:<userId>` - so nobody outside that recipient's
// own connections can receive events emitted to it.
const authenticateSocket = async (socket, next) => {
  try {
    // Prefer the token passed explicitly in the handshake `auth` payload
    // (fetched via GET /api/auth/socket-token, which rides the same-origin
    // Vercel rewrite) - the httpOnly cookie is set cross-site on the
    // deployed app and gets dropped by browsers that block/partition
    // third-party cookies (Safari, Firefox, and a growing share of Chrome),
    // even with SameSite=None; Secure. Cookie stays as a fallback for
    // same-site setups (e.g. local dev) that never hit that restriction.
    const token = socket.handshake.auth?.token || parseCookie(socket.handshake.headers.cookie, "token");

    if (!token) {
      console.error("Socket auth failed: no token in handshake auth payload or cookie (cookie header:", socket.handshake.headers.cookie, ")");
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id || decoded._id;

    if (!userId) {
      console.error("Socket auth failed: token decoded but no userId field", decoded);
      return next(new Error("Unauthorized"));
    }

    if (decoded.role === "vendor") {
      const vendor = await Vendor.findOne({ userId }).select("_id");

      if (!vendor) {
        console.error(`Socket auth failed: no Vendor doc for userId ${userId}`);
        return next(new Error("Unauthorized"));
      }

      socket.room = `vendor:${vendor._id}`;
    } else if (decoded.role === "user" || decoded.role === "admin") {
      // Admins are User documents too, so their notifications reuse the
      // same `user:<id>` room as a regular customer's.
      socket.room = `user:${userId}`;
    } else {
      console.error(`Socket auth failed: unrecognized role "${decoded.role}"`);
      return next(new Error("Unauthorized"));
    }

    next();
  } catch (error) {
    console.error("Socket auth failed:", error.message);
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
    socket.join(socket.room);

    socket.on("disconnect", () => {
      socket.leave(socket.room);
    });
  });

  return io;
};







export const emitToVendor = (vendorId, event, payload) => {
  if (!io || !vendorId) return;
  io.to(`vendor:${vendorId.toString()}`).emit(event, payload);
};

export const emitToUser = (userId, event, payload) => {
  if (!io || !userId) return;
  io.to(`user:${userId.toString()}`).emit(event, payload);
};
