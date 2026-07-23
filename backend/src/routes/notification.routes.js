import express from "express";
import {
  getMyNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteOneNotification,
  deleteAllNotifications,
} from "../controllers/notification.controller.js";
import { verifyToken, allowedRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyToken, allowedRoles("vendor", "user", "admin"));

router.get("/", getMyNotifications);

router.get("/unread-count", getUnreadCount);

router.patch("/read-all", markAllNotificationsRead);

router.patch("/:id/read", markNotificationRead);

router.delete("/:id/delete", deleteOneNotification);

router.delete("/", deleteAllNotifications);

export default router;
