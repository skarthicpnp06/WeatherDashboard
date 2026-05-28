import React, { useState, useEffect } from 'react'
import { getWeatherHistory } from '../Services/weatherservice'

const Analytics = ({ currentCity }) => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!currentCity) return

    const fetchHistory = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getWeatherHistory(currentCity)
        setHistory(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [currentCity])

  if (!currentCity) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>
        <h3>📊 Please look up a city on the weather dashboard to see historical trends.</h3>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', color: 'white', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>📊 Historical Search Query Logs: {currentCity.toUpperCase()}</h2>
      
      {loading && <p style={{ textAlign: 'center' }}>Loading chronological matrix logs...</p>}
      {error && <p style={{ color: '#ff6b6b', textAlign: 'center' }}>Error: {error}</p>}

      {!loading && history.length === 0 && <p style={{ textAlign: 'center' }}>No historical entries log mapped in your database yet.</p>}

      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.3)' }}>
              <th style={{ padding: '12px' }}>Query Log ID</th>
              <th style={{ padding: '12px' }}>Temperature</th>
              <th style={{ padding: '12px' }}>Feels Like</th>
              <th style={{ padding: '12px' }}>Humidity</th>
              <th style={{ padding: '12px' }}>Wind Speed</th>
              <th style={{ padding: '12px' }}>Conditions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', idx: item.id }}>
                <td style={{ padding: '12px' }}># {item.id}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.temparature}°C</td>
                <td style={{ padding: '12px' }}>{item.feelsLike}°C</td>
                <td style={{ padding: '12px' }}>{item.humidity}%</td>
                <td style={{ padding: '12px' }}>{item.windSpeed} m/s</td>
                <td style={{ padding: '12px', textTransform: 'capitalize', color: '#ddd' }}>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Analytics