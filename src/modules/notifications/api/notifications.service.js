import client from "../../../shared/http/client";

const unwrap = (res) =>
  res.data?.success && res.data?.data !== undefined ? res.data.data : res.data;

/** GET /notifications?page=1&limit=20 */
export async function getNotifications(params = {}) {
  const res = await client.get("/notifications", { params });
  return unwrap(res);
}

/** GET /notifications/unread-count */
export async function getUnreadCount() {
  const res = await client.get("/notifications/unread-count");
  return unwrap(res);
}

/** PATCH /notifications/:id/read */
export async function markAsRead(id) {
  const res = await client.patch(`/notifications/${id}/read`);
  return unwrap(res);
}

/** PATCH /notifications/mark-all-read */
export async function markAllAsRead() {
  const res = await client.patch("/notifications/mark-all-read");
  return unwrap(res);
}

/** DELETE /notifications/:id */
export async function deleteNotification(id) {
  const res = await client.delete(`/notifications/${id}`);
  return unwrap(res);
}
