import React, { useState, useEffect, useRef } from 'react'
import { getWeatherData, getCitySuggestions } from '../Services/weatherservice'
import { useDebounce } from '../Hooks/useDebounce'
import Loader from '../Components/Loader'
import Errormessage from '../Components/Errormessage'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, Legend
} from 'recharts'

const AQI_LABELS = { 1: 'Good', 2: 'Fair', 3: 'Moderate', 4: 'Poor', 5: 'Hazardous' }
const AQI_COLORS = { 1: '#22c55e', 2: '#84cc16', 3: '#f59e0b', 4: '#f97316', 5: '#ef4444' }

const Analytics = () => {
  const [inputCity, setInputCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debouncedInput = useDebounce(inputCity, 300)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedInput.trim().length < 2) { setSuggestions([]); return }
      try {
        const res = await getCitySuggestions(debouncedInput)
        setSuggestions(res.slice(0, 6))
      } catch { setSuggestions([]) }
    }
    fetchSuggestions()
  }, [debouncedInput])

  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const fetchCity = async (city) => {
    if (!city.trim()) return
    setLoading(true)
    setError('')
    setWeather(null)
    setShowSuggestions(false)
    try {
      const data = await getWeatherData(city)
      setWeather(data)
      setInputCity(data.city || city)
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchCity(inputCity)
  }

  const handleSuggestionClick = (s) => {
    setInputCity(s)
    fetchCity(s)
  }

  const barData = weather
    ? [
        { name: 'Temp °C', value: parseFloat(weather.temparature?.toFixed(1)) || 0, fill: '#ef4444' },
        { name: 'Feels °C', value: parseFloat(weather.feelsLike?.toFixed(1)) || 0, fill: '#f97316' },
        { name: 'Humidity %', value: weather.humidity || 0, fill: '#3b82f6' },
        { name: 'Wind m/s', value: parseFloat(weather.windSpeed?.toFixed(1)) || 0, fill: '#f59e0b' },
        { name: 'Precip mm', value: parseFloat(weather.precipitation?.toFixed(2)) || 0, fill: '#22c55e' },
        { name: 'AQI Level', value: weather.aqi || 0, fill: AQI_COLORS[weather.aqi] || '#6b7280' },
      ]
    : []

  const radarData = weather
    ? [
        { subject: 'Temperature', A: Math.min(100, ((weather.temparature || 0) / 50) * 100) },
        { subject: 'Humidity', A: weather.humidity || 0 },
        { subject: 'Wind', A: Math.min(100, ((weather.windSpeed || 0) / 30) * 100) },
        { subject: 'Precipitation', A: Math.min(100, ((weather.precipitation || 0) / 20) * 100) },
        { subject: 'AQI', A: ((weather.aqi || 1) / 5) * 100 },
      ]
    : []

  const areaData = weather
    ? [
        { time: '6AM', temp: Math.round((weather.temparature || 0) - 3), humidity: Math.max(0, (weather.humidity || 0) + 5) },
        { time: '9AM', temp: Math.round((weather.temparature || 0) - 1), humidity: Math.max(0, (weather.humidity || 0) + 2) },
        { time: '12PM', temp: Math.round(weather.temparature || 0), humidity: weather.humidity || 0 },
        { time: '3PM', temp: Math.round((weather.temparature || 0) + 2), humidity: Math.max(0, (weather.humidity || 0) - 3) },
        { time: '6PM', temp: Math.round((weather.temparature || 0) + 1), humidity: Math.max(0, (weather.humidity || 0) - 1) },
        { time: '9PM', temp: Math.round((weather.temparature || 0) - 2), humidity: Math.max(0, (weather.humidity || 0) + 3) },
        { time: '12AM', temp: Math.round((weather.temparature || 0) - 4), humidity: Math.max(0, (weather.humidity || 0) + 6) },
      ]
    : []

  return (
    <div className="page-wrapper">
      <div className="analytics-hero-bar">
        <div className="analytics-hero-text">
          <h2 className="page-title">📊 Live Weather Analytics</h2>
          <p className="page-subtitle">Search any city to view live atmospheric data visualized across multiple chart types.</p>
        </div>
      </div>

      <div className="analytics-search-block" ref={wrapperRef}>
        <form onSubmit={handleSearch} className="analytics-search-form">
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              className="input-control analytics-search-input"
              value={inputCity}
              onChange={(e) => { setInputCity(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search city for live analytics (e.g. Coimbatore, Delhi, Mumbai)"
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestion-dropdown">
                {suggestions.map((s, i) => (
                  <li key={i} className="suggestion-item" onClick={() => handleSuggestionClick(s)}>{s}</li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Loading...' : 'Analyse'}
          </button>
        </form>
      </div>

      {loading && <Loader />}
      {error && <Errormessage message={error} />}

      {weather && !loading && (
        <>
          <div className="analytics-live-summary fade-in-up">
            <div className="als-card" style={{ '--als-color': '#ef4444' }}>
              <div className="als-icon">🌡️</div>
              <div className="als-value">{Math.round(weather.temparature)}°C</div>
              <div className="als-label">Temperature</div>
            </div>
            <div className="als-card" style={{ '--als-color': '#3b82f6' }}>
              <div className="als-icon">💧</div>
              <div className="als-value">{weather.humidity}%</div>
              <div className="als-label">Humidity</div>
            </div>
            <div className="als-card" style={{ '--als-color': '#f59e0b' }}>
              <div className="als-icon">💨</div>
              <div className="als-value">{weather.windSpeed?.toFixed(1)} m/s</div>
              <div className="als-label">Wind Speed</div>
            </div>
            <div className="als-card" style={{ '--als-color': '#22c55e' }}>
              <div className="als-icon">🌧️</div>
              <div className="als-value">{weather.precipitation?.toFixed(2)} mm</div>
              <div className="als-label">Precipitation</div>
            </div>
            <div className="als-card" style={{ '--als-color': AQI_COLORS[weather.aqi] || '#6b7280' }}>
              <div className="als-icon">🍃</div>
              <div className="als-value">{AQI_LABELS[weather.aqi] || weather.aqi}</div>
              <div className="als-label">Air Quality</div>
            </div>
            <div className="als-card" style={{ '--als-color': '#8b5cf6' }}>
              <div className="als-icon">🤔</div>
              <div className="als-value">{Math.round(weather.feelsLike)}°C</div>
              <div className="als-label">Feels Like</div>
            </div>
          </div>

          <div className="analytics-source-tag">
            Live data via <strong>{weather.apiSource}</strong> · City: <strong style={{ textTransform: 'capitalize' }}>{weather.city}</strong> · {weather.description}
          </div>

          <div className="card chart-card-full fade-in-up">
            <h3 className="chart-title">📈 Current Weather Metrics Overview</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)', borderRadius: '10px', fontSize: '13px' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, i) => (
                    <rect key={i} fill={entry.fill} />
                  ))}
                </Bar>
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="var(--accent)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="analytics-charts-row">
            <div className="card chart-card-half fade-in-up">
              <h3 className="chart-title">🕸️ Atmospheric Radar</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} stroke="var(--border)" />
                  <Radar name="Conditions" dataKey="A" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.25} strokeWidth={2} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)', borderRadius: '10px', fontSize: '13px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="card chart-card-half fade-in-up">
              <h3 className="chart-title">📉 Estimated Diurnal Trend</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Temperature & humidity variation estimated from current snapshot
              </p>
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={areaData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="time" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)', borderRadius: '10px', fontSize: '13px' }} />
                  <Legend wrapperStyle={{ fontSize: '13px' }} />
                  <Area type="monotone" dataKey="temp" name="Temp °C" stroke="#ef4444" fill="url(#tempGrad)" strokeWidth={2} dot={{ r: 3 }} />
                  <Area type="monotone" dataKey="humidity" name="Humidity %" stroke="#3b82f6" fill="url(#humGrad)" strokeWidth={2} dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card fade-in-up" style={{ marginTop: '20px' }}>
            <h3 className="chart-title">🍃 Air Quality Index Detail</h3>
            <div className="aqi-detail-row">
              <div className="aqi-gauge" style={{ '--aqi-color': AQI_COLORS[weather.aqi] || '#6b7280' }}>
                <div className="aqi-gauge-inner">
                  <div className="aqi-gauge-value">{weather.aqi}</div>
                  <div className="aqi-gauge-label">{AQI_LABELS[weather.aqi] || 'N/A'}</div>
                </div>
              </div>
              <div className="aqi-scale">
                {Object.entries(AQI_LABELS).map(([k, v]) => (
                  <div key={k} className={`aqi-scale-item ${parseInt(k) === weather.aqi ? 'aqi-scale-active' : ''}`} style={{ '--scale-color': AQI_COLORS[k] }}>
                    <span className="aqi-dot" style={{ background: AQI_COLORS[k] }} />
                    <span>Level {k} — {v}</span>
                    {parseInt(k) === weather.aqi && <span className="aqi-current-tag">Current</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {!weather && !loading && !error && (
        <div className="analytics-empty-state">
          <div className="aes-icon">📡</div>
          <h3>Search a city to begin live analysis</h3>
          <p>Enter any city name above to instantly visualise its current atmospheric conditions across temperature, humidity, wind, precipitation, and air quality charts.</p>
        </div>
      )}
    </div>
  )
}

export default Analytics