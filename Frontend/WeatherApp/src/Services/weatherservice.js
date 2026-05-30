const BASE_URL = "http://localhost:8080/weather";

// Primary Real-time Weather Data API
export async function getWeatherData(city) {
  const response = await fetch(`${BASE_URL}?city=${encodeURIComponent(city.trim())}`); 
  if (!response.ok) {
    throw new Error("Failed to load current weather data parameters"); 
  }
  return await response.json(); 
}

// Second Weather API / Route (Ensure it maps here if called directly from UI)
export async function getSecondaryWeatherData(city) {
  const response = await fetch(`${BASE_URL}/secondary?city=${encodeURIComponent(city.trim())}`);
  if (!response.ok) {
    throw new Error("Failed to load secondary weather metrics stream");
  }
  return await response.json();
}

export async function getWeatherHistory(city) {
  const response = await fetch(`${BASE_URL}/history?city=${encodeURIComponent(city.trim())}`); 
  if (!response.ok) {
    throw new Error("Failed to load historical cache data structures"); 
  }
  return await response.json(); 
}

export async function getWeatherForecast(city) {
  const response = await fetch(`${BASE_URL}/forecast?city=${encodeURIComponent(city.trim())}`); 
  if (!response.ok) {
    throw new Error("Failed to load 5-day forecast layout attributes"); 
  }
  return await response.json(); 
}

export async function registerWeatherAlert(alertPayload) {
  const response = await fetch(`${BASE_URL}/alerts`, { 
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify(alertPayload) 
  });
  if (!response.ok) {
    throw new Error("Failed to subscribe to automated weather notifications"); 
  }
  return await response.json(); 
}