const BASE = "https://weatherdashboard-1-5tai.onrender.com/api/disaster";

export async function getDisasterAssessment(city) {
  const response = await fetch(`${BASE}/assess?city=${encodeURIComponent(city.trim())}`);
  if (!response.ok) throw new Error("Failed to load disaster risk assessment.");
  return await response.json();
}

export async function getDisasterHistory(city) {
  const response = await fetch(`${BASE}/history?city=${encodeURIComponent(city.trim())}`);
  if (!response.ok) throw new Error("Failed to load disaster history.");
  return await response.json();
}

export async function getCityCoordinates(city) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en-US,en" } }
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
  } catch (e) {}
  return { lat: 20.5937, lon: 78.9629 };
}