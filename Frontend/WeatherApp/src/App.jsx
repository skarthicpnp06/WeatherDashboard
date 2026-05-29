import React, { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Forecast from './pages/Forecast'
import Compare from './pages/Compare'
import Analytics from './pages/Analytics'
import AlertSetup from './pages/AlertSetup'
import './Styles/dashboard.css'

const App = () => {
  const [activePage, setActivePage] = useState('dashboard')
  const [currentCity, setCurrentCity] = useState('')

  return (
    <div>
      <nav className="navbar">
        <button 
          className={`nav-button ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActivePage('dashboard')}
        >
          ☀️ Current Weather
        </button>
        <button 
          className={`nav-button ${activePage === 'forecast' ? 'active' : ''}`}
          onClick={() => setActivePage('forecast')}
        >
          📅 5-Day Forecast {currentCity && `(${currentCity})`}
        </button>
        <button 
          className={`nav-button ${activePage === 'compare' ? 'active' : ''}`}
          onClick={() => setActivePage('compare')}
        >
          ⚔️ Compare Cities
        </button>
        <button 
          className={`nav-button ${activePage === 'analytics' ? 'active' : ''}`}
          onClick={() => setActivePage('analytics')}
        >
          📊 Analytics
        </button>
        <button 
          className={`nav-button ${activePage === 'alerts' ? 'active' : ''}`}
          onClick={() => setActivePage('alerts')}
        >
          ⏰ Trigger Alerts
        </button>
      </nav>

      <main>
        {activePage === 'dashboard' && <Dashboard setCurrentCity={setCurrentCity} />}
        {activePage === 'forecast' && <Forecast currentCity={currentCity} />}
        {activePage === 'compare' && <Compare />}
        {activePage === 'analytics' && <Analytics currentCity={currentCity} />}
        {activePage === 'alerts' && <AlertSetup />}
      </main>
    </div>
  )
}

export default App