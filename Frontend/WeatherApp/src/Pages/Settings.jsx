import React, { useState, useEffect } from 'react'
import { clearDatabaseCacheHistory } from '../Services/weatherservice'

const Settings = ({ 
  isDarkMode, 
  setIsDarkMode, 
  isCelsius, 
  setIsCelsius, 
  isMetersPerSecond, 
  setIsMetersPerSecond,
  defaultCity,
  setDefaultCity 
}) => {
  const [cacheStatus, setCacheStatus] = useState('')
  const [backendAlive, setBackendAlive] = useState('Checking connectivity...')
  const [inputCity, setInputCity] = useState(defaultCity)

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch("http://localhost:8080/weather?city=coimbatore")
        if (res.ok) {
          setBackendAlive('🟢 Online (Connected to Spring Boot)')
        } else {
          setBackendAlive('🔴 Service Error (Server responded with error status)')
        }
      } catch (err) {
        setBackendAlive('🔴 Offline (Check if backend server is running on port 8080)')
      }
    }
    checkServer()
  }, [])

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark-theme')
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add('dark-theme')
      setIsDarkMode(true)
    }
  }

  const saveDefaultCity = () => {
    const cleanCity = inputCity.trim().toLowerCase()
    localStorage.setItem('skysync_default_city', cleanCity)
    setDefaultCity(cleanCity)
    setCacheStatus(`Favorite city saved: "${cleanCity.toUpperCase()}" will load on startup.`)
    setTimeout(() => setCacheStatus(''), 4000)
  }

  const handleCacheClear = async () => {
    if (!window.confirm("Are you absolutely sure you want to clear all stored search metrics from the database cache? This resets your analytics charts data.")) return

    try {
      setCacheStatus('Evicting historical records...')
      await clearDatabaseCacheHistory()
      setCacheStatus('Database optimized successfully! Cache history is clean.')
      setTimeout(() => setCacheStatus(''), 4000)
    } catch (err) {
      setCacheStatus('Error executing cache maintenance sequence.')
    }
  }

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="glass-panel">
        <h2 style={{ margin: '0 0 10px 0', fontSize: '26px' }}>⚙️ Application Settings</h2>
        <p style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '30px' }}>
          Personalize system configurations and interface styling modules.
        </p>

        <div className="theme-toggle-row">
          <div>
            <h4 style={{ margin: 0, fontSize: '16px' }}>Interface Theme Mode</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#7f8c8d' }}>
              Switch workspace backgrounds across dark and light palettes.
            </p>
          </div>
          <button onClick={toggleTheme} className="btn-primary" style={{ background: isDarkMode ? '#e74c3c' : '#2c3e50', width: '160px' }}>
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <div className="theme-toggle-row" style={{ marginTop: '15px' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px' }}>Temperature Unit Metric</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#7f8c8d' }}>
              Convert displayed global temperature metrics instantly.
            </p>
          </div>
          <button onClick={() => setIsCelsius(!isCelsius)} className="btn-primary" style={{ background: '#3498db', width: '160px' }}>
            {isCelsius ? 'Fahrenheit (°F)' : 'Celsius (°C)'}
          </button>
        </div>

        <div className="theme-toggle-row" style={{ marginTop: '15px' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px' }}>Wind Velocity Metrics</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#7f8c8d' }}>
              Convert wind tracking outputs to preferred dimensional units.
            </p>
          </div>
          <button onClick={() => setIsMetersPerSecond(!isMetersPerSecond)} className="btn-primary" style={{ background: '#2ecc71', width: '160px' }}>
            {isMetersPerSecond ? 'Use km/h' : 'Use m/s'}
          </button>
        </div>

        <div className="theme-toggle-row" style={{ marginTop: '15px', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px' }}>Default Home City</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#7f8c8d' }}>
              Set a primary fallback station to fetch right when the dashboard opens.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <input 
              type="text" 
              value={inputCity} 
              onChange={(e) => setInputCity(e.target.value)} 
              placeholder="e.g. Coimbatore" 
              className="input-control"
            />
            <button onClick={saveDefaultCity} className="btn-primary" style={{ background: '#9b59b6' }}>
              Save
            </button>
          </div>
        </div>

        <div className="theme-toggle-row" style={{ marginTop: '15px' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px' }}>API Engine Connectivity</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#7f8c8d' }}>
              Live connection verification with Spring Boot architecture server.
            </p>
          </div>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>{backendAlive}</span>
        </div>

        <div className="theme-toggle-row" style={{ marginTop: '15px', borderBottom: 'none' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px', color: '#e74c3c' }}>Cache Database Maintenance</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#7f8c8d' }}>
              Evict cached database query rows to clear performance trends.
            </p>
          </div>
          <button onClick={handleCacheClear} className="btn-primary" style={{ background: '#e74c3c', width: '160px' }}>
            Purge History
          </button>
        </div>

        {cacheStatus && (
          <p style={{ marginTop: '15px', padding: '10px', background: 'rgba(52,152,219,0.1)', borderRadius: '6px', fontSize: '13px', textAlign: 'center', fontWeight: '500' }}>
            ℹ️ {cacheStatus}
          </p>
        )}
      </div>
    </div>
  )
}

export default Settings