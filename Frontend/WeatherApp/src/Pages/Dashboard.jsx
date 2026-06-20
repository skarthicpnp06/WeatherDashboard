import React, { useState, useEffect, useRef } from 'react'
import { getWeatherData, getCitySuggestions } from '../Services/weatherservice.js'
import WeatherCard from '../Components/WeatherCard.jsx'
import Loader from '../Components/Loader.jsx'
import Errormessage from '../Components/Errormessage.jsx'
import { useDebounce } from '../Hooks/useDebounce.js'

const Dashboard = ({ setCurrentCity, isCelsius, isMetersPerSecond, defaultCity }) => {
  const [inputCity, setInputCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debouncedInput = useDebounce(inputCity, 300)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (defaultCity && !weather && !loading) {
      fetchCity(defaultCity)
    }
  }, [defaultCity])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedInput.trim().length < 2) {
        setSuggestions([])
        return
      }
      try {
        const results = await getCitySuggestions(debouncedInput)
        setSuggestions(results.slice(0, 6))
      } catch {
        setSuggestions([])
      }
    }
    fetchSuggestions()
  }, [debouncedInput])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchCity = async (city) => {
    setLoading(true)
    setError(null)
    setWeather(null)
    setShowSuggestions(false)
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

  const handleSuggestionClick = (city) => {
    setInputCity(city)
    fetchCity(city)
  }

  return (
    <div className="page-wrapper fade-in" style={{ maxWidth: '620px' }}>
      <div className="card">
        <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '4px' }}>
          Current Weather
        </h1>
        <p className="page-subtitle">Enter a city name to retrieve live conditions.</p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '6px', position: 'relative' }} ref={wrapperRef}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              value={inputCity}
              onChange={(e) => { setInputCity(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="City name, e.g. Coimbatore"
              className="input-control"
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestion-dropdown">
                {suggestions.map((s, idx) => (
                  <li key={idx} className="suggestion-item" onClick={() => handleSuggestionClick(s)}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Search
          </button>
        </form>

        {loading && <Loader />}
        {error && !loading && <Errormessage message={error} />}
        {weather && !loading && !error && (
          <div className="fade-in-up" style={{ marginTop: '24px' }}>
            <WeatherCard weather={weather} isCelsius={isCelsius} isMetersPerSecond={isMetersPerSecond} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard