import React, { useState } from 'react'
import Dashboard from './Pages/Dashboard'
import Forecast from './Pages/Forecast'
import Compare from './Pages/Compare'
import Analytics from './Pages/Analytics'
import AlertSetup from './Pages/AlertSetup'
import Settings from './Pages/Settings'
import AIChatbotPage from './Pages/AiChatBotPage'
import FarmerAdvisoryPage from './Pages/Farmeradvisorypage'
import DisasterManagementPage from './Pages/DisasterManagementpage'
import AdminDashboardPage from './Pages/AdminDashboardpage'
import './Styles/dashboard.css'

const App = () => {
  const [activePage, setActivePage] = useState('dashboard')
  const [currentCity, setCurrentCity] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isCelsius, setIsCelsius] = useState(true)
  const [isMetersPerSecond, setIsMetersPerSecond] = useState(true)
  const [defaultCity, setDefaultCity] = useState(() => localStorage.getItem('skysync_default_city') || '')

  const nav = (page) => setActivePage(page)

  return (
    <div>
      <nav className="navbar">
        <span className="nav-brand" onClick={() => nav('dashboard')} style={{ cursor: 'pointer' }}>
          ⛅ SkySync
        </span>

        <div className="nav-group">
          <button className={`nav-button ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => nav('dashboard')}>Dashboard</button>
          <button className={`nav-button ${activePage === 'forecast' ? 'active' : ''}`} onClick={() => nav('forecast')}>
            Forecast {currentCity ? `(${currentCity})` : ''}
          </button>
          <button className={`nav-button ${activePage === 'compare' ? 'active' : ''}`} onClick={() => nav('compare')}>Compare</button>
          <button className={`nav-button ${activePage === 'analytics' ? 'active' : ''}`} onClick={() => nav('analytics')}>Analytics</button>
          <button className={`nav-button ${activePage === 'alerts' ? 'active' : ''}`} onClick={() => nav('alerts')}>Alerts</button>
        </div>

        <span className="nav-divider" />

        <div className="nav-group nav-group-new">
          <button className={`nav-button nav-ai ${activePage === 'chatbot' ? 'active' : ''}`} onClick={() => nav('chatbot')}>🤖 AI Chat</button>
          <button className={`nav-button nav-farmer ${activePage === 'farmer' ? 'active' : ''}`} onClick={() => nav('farmer')}>🌾 Farmer</button>
          <button className={`nav-button nav-disaster ${activePage === 'disaster' ? 'active' : ''}`} onClick={() => nav('disaster')}>⚠️ Disaster</button>
          <button className={`nav-button nav-admin ${activePage === 'admin' ? 'active' : ''}`} onClick={() => nav('admin')}>🔐 Admin</button>
        </div>

        <button className={`settings-icon-btn ${activePage === 'settings' ? 'active' : ''}`} onClick={() => nav('settings')} title="Settings">⚙️</button>
      </nav>

      <main>
        {activePage === 'dashboard' && <Dashboard setCurrentCity={setCurrentCity} isCelsius={isCelsius} isMetersPerSecond={isMetersPerSecond} defaultCity={defaultCity} />}
        {activePage === 'forecast' && <Forecast currentCity={currentCity} />}
        {activePage === 'compare' && <Compare isCelsius={isCelsius} isMetersPerSecond={isMetersPerSecond} />}
        {activePage === 'analytics' && <Analytics />}
        {activePage === 'alerts' && <AlertSetup />}
        {activePage === 'chatbot' && <AIChatbotPage currentCity={currentCity} />}
        {activePage === 'farmer' && <FarmerAdvisoryPage />}
        {activePage === 'disaster' && <DisasterManagementPage />}
        {activePage === 'admin' && <AdminDashboardPage />}
        {activePage === 'settings' && (
          <Settings
            isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}
            isCelsius={isCelsius} setIsCelsius={setIsCelsius}
            isMetersPerSecond={isMetersPerSecond} setIsMetersPerSecond={setIsMetersPerSecond}
            defaultCity={defaultCity} setDefaultCity={setDefaultCity}
          />
        )}
      </main>
    </div>
  )
}

export default App