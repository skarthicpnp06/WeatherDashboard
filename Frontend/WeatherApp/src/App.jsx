import React, { useState } from 'react'
import Dashboard from './Pages/Dashboard'
import Forecast from './Pages/Forecast'
import Compare from './Pages/Compare'
import Analytics from './Pages/Analytics'
import AlertSetup from './Pages/AlertSetup'
import Settings from './Pages/Settings'
import './Styles/dashboard.css'

const App = () => {
  const [activePage, setActivePage] = useState('dashboard')
  const [currentCity, setCurrentCity] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isCelsius, setIsCelsius] = useState(true)
  const [isMetersPerSecond, setIsMetersPerSecond] = useState(true)
  const [defaultCity, setDefaultCity] = useState(() => {
    return localStorage.getItem('skysync_default_city') || ''
  })

  return (
    <div>
      <nav className="navbar">
        <button className={`nav-button ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => setActivePage('dashboard')} >
          Current Weather
        </button>
        <button className={`nav-button ${activePage === 'forecast' ? 'active' : ''}`} onClick={() => setActivePage('forecast')} >
          5-Day Forecast {currentCity && `(${currentCity})`}
        </button>
        <button className={`nav-button ${activePage === 'compare' ? 'active' : ''}`} onClick={() => setActivePage('compare')} >
          Compare Cities
        </button>
        <button className={`nav-button ${activePage === 'analytics' ? 'active' : ''}`} onClick={() => setActivePage('analytics')} >
          Analytics
        </button>
        <button className={`nav-button ${activePage === 'alerts' ? 'active' : ''}`} onClick={() => setActivePage('alerts')} >
          Trigger Alerts
        </button>
        <button className={`settings-icon-btn ${activePage === 'settings' ? 'active' : ''}`} onClick={() => setActivePage('settings')} title="Settings" >
          ⚙️
        </button>
      </nav>
      <main>
        {activePage === 'dashboard' && (
          <Dashboard 
            setCurrentCity={setCurrentCity} 
            isCelsius={isCelsius} 
            isMetersPerSecond={isMetersPerSecond}
            defaultCity={defaultCity}
          />
        )}
        {activePage === 'forecast' && <Forecast currentCity={currentCity} />}
        {activePage === 'compare' && <Compare />}
        {activePage === 'analytics' && <Analytics currentCity={currentCity} />}
        {activePage === 'alerts' && <AlertSetup />}
        {activePage === 'settings' && (
          <Settings 
            isDarkMode={isDarkMode} 
            setIsDarkMode={setIsDarkMode} 
            isCelsius={isCelsius} 
            setIsCelsius={setIsCelsius}
            isMetersPerSecond={isMetersPerSecond}
            setIsMetersPerSecond={setIsMetersPerSecond}
            defaultCity={defaultCity}
            setDefaultCity={setDefaultCity}
          />
        )}
      </main>
    </div>
  )
}

export default App