const BASE = "https://weatherdashboard-1-5tai.onrender.com/api/farmer";

export async function getFarmerAdvisory(city) {
  const response = await fetch(`${BASE}/advisory?city=${encodeURIComponent(city.trim())}`);
  if (!response.ok) throw new Error("Failed to load farmer advisory data.");
  return await response.json();
}