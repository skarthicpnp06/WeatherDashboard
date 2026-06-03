import React from 'react'

const WeatherCard = ({ weather, isCelsius, isMetersPerSecond }) => {
  if (!weather) return null

  const displayTemp = (celsiusValue) => {
    if (isCelsius) return `${Math.round(celsiusValue)}°C`
    const fahrenheit = (celsiusValue * 9) / 5 + 32
    return `${Math.round(fahrenheit)}°F`
  }

  const displayWind = (mpsValue) => {
    if (isMetersPerSecond) return `${mpsValue.toFixed(1)} m/s`
    const kph = mpsValue * 3.6
    return `${kph.toFixed(1)} km/h`
  }

  const getAqiLabel = (aqiValue) => {
    switch (aqiValue) {
      case 1: return "Excellent (Level 1)"
      case 2: return "Fair (Level 2)"
      case 3: return "Moderate (Level 3)"
      case 4: return "Poor (Level 4)"
      case 5: return "Hazardous (Level 5)"
      default: return "Unknown"
    }
  }

  return (
    <div className="weather-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2 className="weather-city" style={{ margin: 0 }}>{weather.city}</h2>
        <span style={{
          background: 'rgba(255,193,7,0.25)',
          color: '#ffc107',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          border: '1px solid rgba(255,193,7,0.4)'
        }}>
          🔌 Source: {weather.apiSource || "Unknown API Engine"}
        </span>
      </div>
      <p className="weather-desc">✨ {weather.description}</p>
      
      <div className="temp-container">
        <span className="main-temp">{displayTemp(weather.temparature)}</span>
        <span className="feels-temp">Feels like {displayTemp(weather.feelsLike)}</span>
      </div>

      <hr className="metrics-divider" />

      <div className="metrics-grid" style={{ flexWrap: 'wrap', gap: '20px' }}>
        <div className="metric-item">
          <span className="metric-label">💧 Humidity</span>
          <span className="metric-value">{weather.humidity}%</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">💨 Wind Speed</span>
          <span className="metric-value">{displayWind(weather.windSpeed)}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">🍃 Air Quality (AQI)</span>
          <span className="metric-value" style={{ fontSize: '15px', color: weather.aqi > 3 ? '#ff6b6b' : '#ffc107' }}>
            {getAqiLabel(weather.aqi)}
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">🌧️ Precipitation</span>
          <span className="metric-value">{weather.precipitation.toFixed(2)} mm</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard