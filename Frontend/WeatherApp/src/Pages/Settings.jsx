import React, { useState, useEffect } from 'react'
import { clearDatabaseCacheHistory } from '../Services/weatherservice'

const Settings = ({
  isDarkMode, setIsDarkMode,
  isCelsius, setIsCelsius,
  isMetersPerSecond, setIsMetersPerSecond,
  defaultCity, setDefaultCity
}) => {
  const [cacheStatus, setCacheStatus] = useState('')
  const [backendAlive, setBackendAlive] = useState('Checking...')
  const [inputCity, setInputCity] = useState(defaultCity)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('https://weatherdashboard-1-5tai.onrender.com/weather?city=london')
        setBackendAlive(res.ok ? 'Connected' : 'Unreachable')
      } catch {
        setBackendAlive('Unreachable')
      }
    }
    check()
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
    const clean = inputCity.trim().toLowerCase()
    localStorage.setItem('skysync_default_city', clean)
    setDefaultCity(clean)
    setCacheStatus(`Default city set to "${clean.toUpperCase()}"`)
    setTimeout(() => setCacheStatus(''), 4000)
  }

  const handleCacheClear = async () => {
    if (!window.confirm('This will permanently delete all cached weather history from the database. Continue?')) return
    try {
      setCacheStatus('Clearing history...')
      await clearDatabaseCacheHistory()
      setCacheStatus('History cleared successfully.')
    } catch {
      setCacheStatus('Failed to clear history.')
    }
    setTimeout(() => setCacheStatus(''), 4000)
  }

  const backendColor = backendAlive === 'Connected' ? 'var(--success)' : backendAlive === 'Checking...' ? 'var(--text-muted)' : 'var(--danger)'

  return (
    <div className="page-wrapper" style={{ maxWidth: '680px' }}>
      <div className="card">
        <h2 className="page-title">Settings</h2>
        <p className="page-subtitle">Configure display preferences and system options.</p>

        <div className="settings-row">
          <div>
            <div className="settings-row-label">Theme</div>
            <div className="settings-row-desc">Switch between light and dark interface modes.</div>
          </div>
          <button onClick={toggleTheme} className="btn btn-ghost" style={{ minWidth: '130px' }}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="settings-row">
          <div>
            <div className="settings-row-label">Temperature Unit</div>
            <div className="settings-row-desc">Toggle between Celsius and Fahrenheit.</div>
          </div>
          <button onClick={() => setIsCelsius(!isCelsius)} className="btn btn-ghost" style={{ minWidth: '130px' }}>
            {isCelsius ? 'Switch to °F' : 'Switch to °C'}
          </button>
        </div>

        <div className="settings-row">
          <div>
            <div className="settings-row-label">Wind Speed Unit</div>
            <div className="settings-row-desc">Toggle between m/s and km/h.</div>
          </div>
          <button onClick={() => setIsMetersPerSecond(!isMetersPerSecond)} className="btn btn-ghost" style={{ minWidth: '130px' }}>
            {isMetersPerSecond ? 'Switch to km/h' : 'Switch to m/s'}
          </button>
        </div>

        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
          <div>
            <div className="settings-row-label">Default City</div>
            <div className="settings-row-desc">Automatically loaded when the dashboard opens.</div>
          </div>
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <input
              type="text"
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              placeholder="e.g. Coimbatore"
              className="input-control"
            />
            <button onClick={saveDefaultCity} className="btn btn-primary">
              Save
            </button>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <div className="settings-row-label">Backend Status</div>
            <div className="settings-row-desc">Live connection check with the Render deployment.</div>
          </div>
          <span style={{ fontWeight: '700', fontSize: '14px', color: backendColor }}>
            {backendAlive}
          </span>
        </div>

        <div className="settings-row" style={{ borderBottom: 'none' }}>
          <div>
            <div className="settings-row-label" style={{ color: 'var(--danger)' }}>Clear History</div>
            <div className="settings-row-desc">Permanently delete all cached search records from the database.</div>
          </div>
          <button onClick={handleCacheClear} className="btn btn-danger" style={{ minWidth: '130px' }}>
            Clear Cache
          </button>
        </div>

        {cacheStatus && (
          <div style={{ marginTop: '16px', padding: '12px 16px', background: 'var(--accent-soft)', color: 'var(--accent)', borderRadius: 'var(--radius-sm)', fontSize: '13.5px', fontWeight: '600' }}>
            {cacheStatus}
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings