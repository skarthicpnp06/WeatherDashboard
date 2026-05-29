import React from 'react'

const WeatherCard = ({ weather }) => {
  if (!weather) return null

  return (
    <div className="weather-card">
      <h2 className="weather-city">{weather.city}</h2>
      <p className="weather-desc">✨ {weather.description}</p>
      
      <div className="temp-container">
        {/* Fixed property name key mapping: temparature */}
        <span className="main-temp">{Math.round(weather.temparature)}°C</span>
        <span className="feels-temp">Feels like {Math.round(weather.feelsLike)}°C</span>
      </div>

      <hr className="metrics-divider" />

      <div className="metrics-grid">
        <div className="metric-item">
          <span className="metric-label">💧 Humidity</span>
          <span className="metric-value">{weather.humidity}%</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">💨 Wind Speed</span>
          <span className="metric-value">{weather.windSpeed} m/s</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard