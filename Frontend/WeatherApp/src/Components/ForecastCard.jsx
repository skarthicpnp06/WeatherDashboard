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
      <div style={{ maxWidth: '600px', margin: '40px auto' }} className="glass-panel">
        <h3 style={{ textAlign: 'center', color: 'white', margin: 0 }}>🔍 Please search for a city on the Current Weather tab first!</h3>
      </div>
    )
  }

  const forecastList = forecastData?.list || []

  const formatTimeStr = (str) => {
    const date = new Date(str)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit'
    })
  }

  return (
    <div className="container">
      <div className="glass-panel">
        <h2 style={{ color: 'white', margin: '0 0 25px 0', textAlign: 'center', fontSize: '26px' }}>
          📅 5-Day Forecast: <span style={{ color: '#ffc107' }}>{currentCity.toUpperCase()}</span>
        </h2>
        
        {loading && <Loader />}
        {error && <Errormessage message={error} />}

        {!loading && !error && (
          <div className="forecast-grid">
            {forecastList.map((item, index) => (
              <div className="forecast-card-wrapper" key={index}>
                <p className="forecast-time">⏰ {formatTimeStr(item.dt_txt)}</p>
                <h3 className="forecast-temp-val">{Math.round(item.main.temp)}°C</h3>
                <p style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '0 0 12px 0', textTransform: 'capitalize' }}>
                  {item.weather[0].description}
                </p>
                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  <div>Feels: {Math.round(item.main.feels_like)}°C</div>
                  <div>Hum: {item.main.humidity}%</div>
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