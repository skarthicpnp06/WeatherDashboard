import React, { useState, useEffect } from 'react'
import { getWeatherForecast } from '../Services/weatherservice'
import '../Styles/dashboard.css'

const Forecast = ({ currentCity }) => {
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!currentCity) return

    const fetchForecast = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getWeatherForecast(currentCity)
        setForecastData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchForecast()
  }, [currentCity])

  if (!currentCity) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>
        <h3>🔍 Please search for a city on the Current Weather tab first!</h3>
      </div>
    )
  }

  if (loading) return <p style={{ color: 'white', textAlign: 'center', padding: '20px' }}>Loading 5-day forecast data...</p>
  if (error) return <p style={{ color: '#ff6b6b', textAlign: 'center', padding: '20px' }}>Error: {error}</p>

  const forecastList = forecastData?.list || []

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
    <div style={{ padding: '10px 20px' }}>
      <h2 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>
        📅 5-Day Forecast: {currentCity.toUpperCase()}
      </h2>
      
      <div style={styles.forecastGrid}>
        {forecastList.map((item, index) => (
          <div className="weather-card" key={index} style={styles.cardOverride}>
            <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', margin: '0 0 8px 0' }}>
              ⏰ {formatTimeStr(item.dt_txt)}
            </p>
            <h3 style={{ fontSize: '28px', margin: '5px 0', color: '#222' }}>
              {Math.round(item.main.temp)}°C
            </h3>
            <p style={{ fontStyle: 'italic', color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>
              ✨ {item.weather[0].description}
            </p>
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '10px 0' }} />
            <div style={styles.smallMetrics}>
              <div>🤔 Feels: {Math.round(item.main.feels_like)}°C</div>
              <div>💧 Hum: {item.main.humidity}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  forecastGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
    marginTop: '10px'
  },
  cardOverride: {
    minWidth: '220px',
    flex: '1 1 calc(20% - 20px)',
    maxWidth: '280px',
    margin: '0',
    background: 'white',
    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
    borderRadius: '12px',
    padding: '15px'
  },
  smallMetrics: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#444',
    fontWeight: '500'
  }
}

export default Forecast