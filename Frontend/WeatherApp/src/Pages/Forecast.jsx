import React, { useState, useEffect } from 'react'
import { getWeatherForecast } from '../Services/weatherservice'
import Loader from '../Components/Loader'
import Errormessage from '../Components/Errormessage'

const Forecast = ({ currentCity }) => {
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!currentCity) return
    const fetch = async () => {
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
    fetch()
  }, [currentCity])

  const formatTime = (str) => {
    const d = new Date(str)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (!currentCity) {
    return (
      <div className="page-wrapper" style={{ maxWidth: '700px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            Search for a city on the Current Weather tab first to load its forecast.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2 className="page-title">5-Day Forecast</h2>
        <p className="page-subtitle" style={{ textTransform: 'capitalize' }}>{currentCity}</p>

        {loading && <Loader />}
        {error && <Errormessage message={error} />}

        {!loading && !error && forecastData && (
          <div className="forecast-grid">
            {(forecastData.list || []).map((item, index) => (
              <div className="forecast-tile" key={index}>
                <div className="forecast-time">{formatTime(item.dt_txt)}</div>
                <div className="forecast-temp">{Math.round(item.main.temp)}°C</div>
                <div className="forecast-cond">{item.weather[0].description}</div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>Feels {Math.round(item.main.feels_like)}°C</span>
                  <span>Hum {item.main.humidity}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Forecast