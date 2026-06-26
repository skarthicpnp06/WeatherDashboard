const BASE = "https://weatherdashboard-1-5tai.onrender.com/api/admin";

export async function verifyAdminPassword(password) {
  const response = await fetch(`${BASE}/verify`, {
    method: "POST",
    headers: { "X-Admin-Token": password }
  });
  if (!response.ok) return false;
  const data = await response.json();
  return data.verified === true;
}

export async function getAdminStats(password) {
  const response = await fetch(`${BASE}/stats`, {
    headers: { "X-Admin-Token": password }
  });
  if (response.status === 401) throw new Error("Unauthorized. Invalid admin password.");
  if (!response.ok) throw new Error("Failed to load admin statistics.");
  return await response.json();
}