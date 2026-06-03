import React from 'react'

const ForecastCard = ({ item }) => {
  const formatTimeStr = (str) => {
    const date = new Date(str)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="forecast-card-wrapper">
      <p className="forecast-time">⏰ {formatTimeStr(item.dt_txt)}</p>
      <h3 className="forecast-temp-val">{Math.round(item.main.temp)}°C</h3>
      <p style={{ fontStyle: 'italic', color: '#64748b', fontSize: '14px', margin: '0 0 12px 0', textTransform: 'capitalize' }}>
        {item.weather[0].description}
      </p>
      <hr style={{ border: 'none', borderTop: '1px solid #edf2f7', margin: '12px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
        <div>Feels: {Math.round(item.main.feels_like)}°C</div>
        <div>Hum: {item.main.humidity}%</div>
      </div>
    </div>
  )
}

export default ForecastCard