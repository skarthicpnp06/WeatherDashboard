import React from 'react'


const API_BASE_URL = "https://weatherdashboard-1.onrender.com/weather";

export async function getWeatherData(city) {
  const response = await fetch(`${BASE_URL}?city=${encodeURIComponent(city.trim())}`); 
  if (!response.ok) {
    throw new Error("Failed to load current weather data parameters"); 
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

export async function clearDatabaseCacheHistory() {
  const response = await fetch(`${BASE_URL}/history/clear`, {
    method: "DELETE"
  });
  if (!response.ok) {
    throw new Error("Failed to process cache database eviction sequence.");
  }
  return await response.json();
}

export async function disableWeatherAlert(email, city) {
  const response = await fetch(`${BASE_URL}/alerts/disable?email=${encodeURIComponent(email.trim())}&city=${encodeURIComponent(city.trim())}`, {
    method: "DELETE"
  });
  if (!response.ok) {
    throw new Error("Failed to deactivate your weather alert tracking stream.");
  }
  return await response.json();
}