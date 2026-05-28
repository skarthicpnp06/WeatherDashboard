import React from 'react'
import '../Styles/dashboard.css'

const WeatherCard = ({ weather }) => {
  if (!weather) return null

  return (
    <div className="weather-card" style={{ background: 'white', borderRadius: '15px', padding: '25px', textAlign: 'center', marginTop: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
      <h2 style={{ textTransform: 'uppercase', margin: '0 0 5px 0', color: '#333' }}>{weather.city}</h2>
      <p style={{ textTransform: 'capitalize', color: '#777', fontStyle: 'italic', margin: '0 0 20px 0' }}>✨ {weather.description}</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '15px', marginBottom: '20px' }}>
        <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#111' }}>{Math.round(weather.temparature)}°C</span>
        <span style={{ fontSize: '16px', color: '#666' }}>Feels like {Math.round(weather.feelsLike)}°C</span>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <span style={{ display: 'block', fontSize: '12px', color: '#888' }}>💧 Humidity</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{weather.humidity}%</span>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '12px', color: '#888' }}>💨 Wind Speed</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{weather.windSpeed} m/s</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard