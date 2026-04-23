import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "./api/notifications.service";

const SOCKET_URL = (import.meta.env.VITE_API_URL || "").replace("/api", "");

export function useNotifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  // ── Load initial notifications from REST ──────────────────────────────────
  const loadNotifications = useCallback(async () => {
    try {
      const data = await getNotifications({ limit: 30 });
      const list = data?.notifications ?? data?.items ?? [];
      setItems(list);
    } catch {
      // silently fail — socket will still work
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Connect socket ────────────────────────────────────────────────────────
  useEffect(() => {
    loadNotifications();

    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("notification", (notification) => {
      setItems((prev) => {
        // Avoid duplicates
        if (prev.some((n) => n._id === notification._id)) return prev;
        return [notification, ...prev];
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [loadNotifications]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleMarkAsRead = useCallback(async (id) => {
    try {
      await markAsRead(id);
      setItems((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {}
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteNotification(id);
      setItems((prev) => prev.filter((n) => n._id !== id));
    } catch {}
  }, []);

  const unreadCount = items.filter((n) => !n.read).length;

  return {
    items,
    loading,
    unreadCount,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDelete,
  };
}
