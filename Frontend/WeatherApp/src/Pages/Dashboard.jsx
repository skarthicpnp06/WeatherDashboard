import React, { useState, useEffect } from 'react'
import { getWeatherData } from '../Services/weatherservice.js'
import WeatherCard from '../Components/WeatherCard.jsx'
import Loader from '../Components/Loader.jsx'
import Errormessage from '../Components/Errormessage.jsx'

const Dashboard = ({ setCurrentCity, isCelsius, isMetersPerSecond, defaultCity }) => {
  const [inputCity, setInputCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (defaultCity && !weather && !loading) {
      const loadInitialCity = async () => {
        setLoading(true)
        try {
          const data = await getWeatherData(defaultCity)
          setWeather(data)
          setCurrentCity(defaultCity)
        } catch (err) {
          console.error("Startup default query error: ", err)
        } finally {
          setLoading(false)
        }
      }
      loadInitialCity()
    }
  }, [defaultCity])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!inputCity.trim()) return
    
    setLoading(true)
    setError(null)
    setWeather(null) 
    
    try {
      const data = await getWeatherData(inputCity)
      if (data && data.city) {
        setWeather(data)
        setCurrentCity(inputCity.trim())
      } else {
        throw new Error("The backend returned an unparsable weather data schema.")
      }
    } catch (err) {
      console.error("Dashboard Resolution Fault: ", err)
      setError(err.message || "Failed to finalize sync sequence across atmospheric endpoints.")
      setWeather(null)
    } finally {
      setLoading(false) 
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto 0 auto' }}>
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#2c3e50', margin: '0 0 25px 0', fontSize: '32px', fontWeight: '700' }}>SkySync Weather</h1>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
          <input 
            type="text" 
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Enter City Name (e.g. Coimbatore)..."
            className="input-control"
          />
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>

        {loading && <Loader />}
        {error && !loading && <Errormessage message={error} />}
        {weather && !loading && !error && (
          <div style={{ marginTop: '25px' }}>
            <WeatherCard weather={weather} isCelsius={isCelsius} isMetersPerSecond={isMetersPerSecond} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard