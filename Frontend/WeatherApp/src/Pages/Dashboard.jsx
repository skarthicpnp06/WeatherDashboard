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
      fetchCity(defaultCity)
    }
  }, [defaultCity])

  const fetchCity = async (city) => {
    setLoading(true)
    setError(null)
    setWeather(null)
    try {
      const data = await getWeatherData(city)
      if (data && data.city) {
        setWeather(data)
        setCurrentCity(city.trim())
      } else {
        throw new Error("Invalid response from weather service.")
      }
    } catch (err) {
      setError(err.message || "Unable to fetch weather data.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!inputCity.trim()) return
    fetchCity(inputCity)
  }

  return (
    <div className="page-wrapper" style={{ maxWidth: '620px' }}>
      <div className="card">
        <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '4px' }}>
          Current Weather
        </h1>
        <p className="page-subtitle">Enter a city name to retrieve live conditions.</p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '6px' }}>
          <input
            type="text"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="City name, e.g. Coimbatore"
            className="input-control"
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Search
          </button>
        </form>

        {loading && <Loader />}
        {error && !loading && <Errormessage message={error} />}
        {weather && !loading && !error && (
          <div style={{ marginTop: '24px' }}>
            <WeatherCard weather={weather} isCelsius={isCelsius} isMetersPerSecond={isMetersPerSecond} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard