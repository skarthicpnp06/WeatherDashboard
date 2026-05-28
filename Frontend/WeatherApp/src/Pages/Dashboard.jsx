import React, { useState } from 'react'
import { getWeatherData } from '../Services/weatherservice'
import WeatherCard from '../Components/WeatherCard'

const Dashboard = ({ setCurrentCity }) => {
  const [inputCity, setInputCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!inputCity.trim()) return
    
    setLoading(true)
    setError(null)
    try {
      const data = await getWeatherData(inputCity)
      setWeather(data)
      setCurrentCity(inputCity.trim())
    } catch (err) {
      setError(err.message)
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: 'white', marginBottom: '25px' }}>SkySync Weather Dashboard</h1>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          placeholder="Enter City Name (e.g. Coimbatore)..."
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#007bff', color: 'white', fontSize: '16px', cursor: 'pointer' }}>
          Search
        </button>
      </form>

      {loading && <p style={{ color: 'white' }}>Fetching real-time streams...</p>}
      {error && <p style={{ color: '#ff6b6b' }}>Error: {error}</p>}
      {weather && <WeatherCard weather={weather} />}
    </div>
  )
}

export default Dashboard