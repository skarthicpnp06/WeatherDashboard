const BASE_URL = "http://localhost:8080/weather";

export async function getWeatherData(city) {
  const response = await fetch(`${BASE_URL}?city=${city}`);
  if (!response.ok) {
    throw new Error("Failed to load current weather data");
  }
  return await response.json();
}

export async function getWeatherHistory(city) {
  const response = await fetch(`${BASE_URL}/history?city=${city}`);
  if (!response.ok) {
    throw new Error("Failed to load historical cache data");
  }
  return await response.json();
}

export async function getWeatherForecast(city) {
  const response = await fetch(`${BASE_URL}/forecast?city=${city}`);
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
    throw new Error("Failed to subscribe to notifications");
  }
  return await response.json();
}