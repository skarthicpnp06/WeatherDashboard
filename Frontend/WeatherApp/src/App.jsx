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
      <nav style={styles.navbar}>
        <button 
          style={{...styles.navButton, fontWeight: activePage === 'dashboard' ? 'bold' : 'normal'}} 
          onClick={() => setActivePage('dashboard')}
        >
          ☀️ Current Weather
        </button>
        <button 
          style={{...styles.navButton, fontWeight: activePage === 'forecast' ? 'bold' : 'normal'}} 
          onClick={() => setActivePage('forecast')}
        >
          📅 5-Day Forecast {currentCity && `(${currentCity})`}
        </button>
        <button 
          style={{...styles.navButton, fontWeight: activePage === 'compare' ? 'bold' : 'normal'}} 
          onClick={() => setActivePage('compare')}
        >
          ⚔️ Compare Cities
        </button>
        <button 
          style={{...styles.navButton, fontWeight: activePage === 'analytics' ? 'bold' : 'normal'}} 
          onClick={() => setActivePage('analytics')}
        >
          📊 Analytics
        </button>
        <button 
          style={{...styles.navButton, fontWeight: activePage === 'alerts' ? 'bold' : 'normal'}} 
          onClick={() => setActivePage('alerts')}
        >
          ⏰ Trigger Alerts
        </button>
      </nav>

      <main style={{ padding: '20px' }}>
        {activePage === 'dashboard' && <Dashboard setCurrentCity={setCurrentCity} />}
        {activePage === 'forecast' && <Forecast currentCity={currentCity} />}
        {activePage === 'compare' && <Compare />}
        {activePage === 'analytics' && <Analytics currentCity={currentCity} />}
        {activePage === 'alerts' && <AlertSetup />}
      </main>
    </div>
  )
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '15px',
    background: 'rgba(0, 0, 0, 0.4)',
    padding: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
  },
  navButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '5px 10px',
    transition: 'font-weight 0.2s ease'
  }
}

export default App