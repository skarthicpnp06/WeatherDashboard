const BASE_URL = "https://weatherdashboard-1-5tai.onrender.com/weather";

export async function getWeatherData(city) {
  const response = await fetch(`${BASE_URL}?city=${encodeURIComponent(city.trim())}`);
  if (!response.ok) throw new Error("Failed to load weather data.");
  return await response.json();
}

export async function getWeatherHistory(city) {
  const response = await fetch(`${BASE_URL}/history?city=${encodeURIComponent(city.trim())}`);
  if (!response.ok) throw new Error("Failed to load history data.");
  return await response.json();
}

export async function getWeatherForecast(city) {
  const response = await fetch(`${BASE_URL}/forecast?city=${encodeURIComponent(city.trim())}`);
  if (!response.ok) throw new Error("Failed to load forecast data.");
  return await response.json();
}

export async function registerWeatherAlert(alertPayload) {
  const response = await fetch(`${BASE_URL}/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(alertPayload)
  });
  if (!response.ok) throw new Error("Failed to register alert.");
  return await response.json();
}

export async function clearDatabaseCacheHistory() {
  const response = await fetch(`${BASE_URL}/history/clear`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to clear history.");
  return await response.json();
}

export async function disableWeatherAlert(email, city) {
  const response = await fetch(
    `${BASE_URL}/alerts/disable?email=${encodeURIComponent(email.trim())}&city=${encodeURIComponent(city.trim())}`,
    { method: "DELETE" }
  );
  if (!response.ok) throw new Error("Failed to disable alert.");
  return await response.json();
}