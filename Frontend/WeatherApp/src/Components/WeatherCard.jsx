import React from 'react'

const WeatherCard = ({ weather, isCelsius = true, isMetersPerSecond = true }) => {
  if (!weather) return null

  const displayTemp = (c) => {
    if (isCelsius) return `${Math.round(c)}°C`
    return `${Math.round((c * 9) / 5 + 32)}°F`
  }

  const displayWind = (mps) => {
    if (isMetersPerSecond) return `${mps.toFixed(1)} m/s`
    return `${(mps * 3.6).toFixed(1)} km/h`
  }

  const aqiLabel = (v) => {
    const map = { 1: 'Good', 2: 'Fair', 3: 'Moderate', 4: 'Poor', 5: 'Hazardous' }
    return map[v] || 'N/A'
  }

  const aqiColor = (v) => v >= 4 ? 'var(--danger)' : v === 3 ? '#b7791f' : 'var(--success)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div className="weather-city-name" style={{ textTransform: 'capitalize' }}>{weather.city}</div>
          <div className="weather-description">{weather.description}</div>
        </div>
        <span className="source-badge">
          {weather.apiSource || 'Unknown Source'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px' }}>
        <span className="temp-display">{displayTemp(weather.temparature)}</span>
        <span className="feels-like-label" style={{ paddingBottom: '10px' }}>
          Feels like {displayTemp(weather.feelsLike)}
        </span>
      </div>

      <hr className="divider" style={{ margin: '4px 0' }} />

      <div className="metric-grid">
        <div className="metric-tile">
          <span className="metric-tile-label">Humidity</span>
          <span className="metric-tile-value">{weather.humidity}%</span>
        </div>
        <div className="metric-tile">
          <span className="metric-tile-label">Wind Speed</span>
          <span className="metric-tile-value">{displayWind(weather.windSpeed)}</span>
        </div>
        <div className="metric-tile">
          <span className="metric-tile-label">Air Quality</span>
          <span className="metric-tile-value" style={{ color: aqiColor(weather.aqi), fontSize: '17px' }}>
            {aqiLabel(weather.aqi)} (AQI {weather.aqi})
          </span>
        </div>
        <div className="metric-tile">
          <span className="metric-tile-label">Precipitation</span>
          <span className="metric-tile-value">{weather.precipitation.toFixed(2)} mm</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard