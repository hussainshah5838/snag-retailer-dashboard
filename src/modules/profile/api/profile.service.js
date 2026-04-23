import client from "../../../shared/http/client";

const unwrap = (res) =>
  res.data?.success && res.data?.data !== undefined ? res.data.data : res.data;

/** GET /retailer/profile */
export async function getProfile() {
  const res = await client.get("/retailer/profile");
  return unwrap(res);
}

/** PUT /retailer/profile — firstName, lastName, phoneNumber (no email) */
export async function updateProfile(data) {
  const res = await client.put("/retailer/profile", data);
  return unwrap(res);
}

/** POST /retailer/profile/avatar — multipart/form-data with `avatar` field */
export async function uploadAvatar(file) {
  const form = new FormData();
  form.append("avatar", file);
  const res = await client.post("/retailer/profile/avatar", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(res);
}
