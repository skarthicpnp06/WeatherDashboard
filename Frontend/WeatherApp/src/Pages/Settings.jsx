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
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/weather";
      try {
        const res = await fetch(`${BASE_URL}?city=coimbatore`)
        if (res.ok) {
          setBackendAlive('🟢 Cloud Instance Core Active')
        } else {
          setBackendAlive('🔴 Core System Return Flag Misalignment')
        }
      } catch (err) {
        setBackendAlive('🔴 Target Stream Disconnected')
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
    setCacheStatus(`Favorite station established: "${cleanCity.toUpperCase()}"`)
    setTimeout(() => setCacheStatus(''), 4000)
  }

  const handleCacheClear = async () => {
    if (!window.confirm("Purge cached application history rows? This structural manipulation completely maps down database logs.")) return

    try {
      setCacheStatus('Evicting historical records...')
      await clearDatabaseCacheHistory()
      setCacheStatus('Cache data entities dropped cleanly.')
      setTimeout(() => setCacheStatus(''), 4000)
    } catch (err) {
      setCacheStatus('Maintenance pipeline tracking fault encountered.')
    }
  }

  return (
    <div className="container" style={{ maxWidth: '650px' }}>
      <div className="glass-panel">
        <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', letterSpacing: '-0.025em' }}>Application Settings</h2>
        <p style={{ fontSize: '14px', color: 'var(--nav-text)', marginBottom: '32px' }}>
          Personalize system configurations and interface styling modules.
        </p>

        <div className="theme-toggle-row">
          <div>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Interface Theme Mode</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--nav-text)' }}>
              Switch workspace backgrounds across dark and light palettes.
            </p>
          </div>
          <button onClick={toggleTheme} className="btn-primary" style={{ background: isDarkMode ? '#dc2626' : '#1e293b', width: '160px' }}>
            {isDarkMode ? '☀️ Light Palette' : '🌙 Dark Slate'}
          </button>
        </div>

        <div className="theme-toggle-row" style={{ marginTop: '15px' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Temperature Metric</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--nav-text)' }}>
              Convert displayed global temperature metrics instantly.
            </p>
          </div>
          <button onClick={() => setIsCelsius(!isCelsius)} className="btn-primary" style={{ background: '#2563eb', width: '160px' }}>
            {isCelsius ? 'Fahrenheit (°F)' : 'Celsius (°C)'}
          </button>
        </div>

        <div className="theme-toggle-row" style={{ marginTop: '15px' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Wind Velocity Metrics</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--nav-text)' }}>
              Convert wind tracking outputs to preferred dimensional units.
            </p>
          </div>
          <button onClick={() => setIsMetersPerSecond(!isMetersPerSecond)} className="btn-primary" style={{ background: '#16a34a', width: '160px' }}>
            {isMetersPerSecond ? 'Use km/h' : 'Use m/s'}
          </button>
        </div>

        <div className="theme-toggle-row" style={{ marginTop: '15px', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Default Home City</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--nav-text)' }}>
              Set a primary fallback station to fetch right when the dashboard opens.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <input 
              type="text" 
              value={inputCity} 
              onChange={(e) => setInputCity(e.target.value)} 
              placeholder="e.g. Coimbatore" 
              className="input-control"
            />
            <button onClick={saveDefaultCity} className="btn-primary" style={{ background: '#7c3aed' }}>
              Save
            </button>
          </div>
        </div>

        <div className="theme-toggle-row" style={{ marginTop: '15px' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>System Core Health</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--nav-text)' }}>
              Live connection verification with active microservice architecture backend.
            </p>
          </div>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>{backendAlive}</span>
        </div>

        <div className="theme-toggle-row" style={{ marginTop: '15px', borderBottom: 'none' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px', color: '#dc2626', fontWeight: '600' }}>System Storage Optimization</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--nav-text)' }}>
              Evict cached database query rows to clear performance trends.
            </p>
          </div>
          <button onClick={handleCacheClear} className="btn-primary" style={{ background: '#dc2626', width: '160px' }}>
            Purge Logs
          </button>
        </div>

        {cacheStatus && (
          <p style={{ marginTop: '20px', padding: '12px', background: 'rgba(37,99,235,0.08)', color: '#2563eb', borderRadius: '8px', fontSize: '14px', textAlign: 'center', fontWeight: '600' }}>
            {cacheStatus}
          </p>
        )}
      </div>
    </div>
  )
}

export default Settings