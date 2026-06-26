import React, { useState } from 'react'
import { getFarmerAdvisory } from '../Services/farmerService'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const RiskBar = ({ score, level }) => {
  const colors = { LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#ef4444' }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>FARMER RISK SCORE</span>
        <span style={{ fontWeight: '700', color: colors[level] || '#6b7280' }}>{level} ({score}/100)</span>
      </div>
      <div className="risk-bar-track">
        <div className="risk-bar-fill" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${colors[level] || '#6b7280'}, ${colors[level] || '#6b7280'}99)`, transition: 'width 1s ease' }} />
      </div>
    </div>
  )
}

const CropTag = ({ crop }) => <span className="crop-tag">{crop}</span>

const AdvisoryCard = ({ icon, label, value, accent }) => (
  <div className="farmer-advisory-card" style={{ borderTopColor: accent }}>
    <div className="farmer-card-icon">{icon}</div>
    <div className="farmer-card-label">{label}</div>
    <div className="farmer-card-value">{value}</div>
  </div>
)

const FarmerAdvisoryPage = () => {
  const [city, setCity] = useState('')
  const [advisory, setAdvisory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!city.trim()) return
    setLoading(true)
    setError('')
    setAdvisory(null)
    try {
      const data = await getFarmerAdvisory(city)
      setAdvisory(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const chartData = advisory
    ? [
        { name: 'Temp °C', value: Math.round(advisory.temperature), fill: '#ef4444' },
        { name: 'Humidity %', value: advisory.humidity, fill: '#3b82f6' },
        { name: 'Wind m/s', value: Math.round(advisory.windSpeed * 10) / 10, fill: '#f59e0b' },
        { name: 'Precip mm', value: Math.round(advisory.precipitation * 100) / 100, fill: '#22c55e' },
      ]
    : []

  return (
    <div className="farmer-page">
      <div className="farmer-hero">
        <div className="farmer-hero-decoration deco-1">🌿</div>
        <div className="farmer-hero-decoration deco-2">🌱</div>
        <div className="farmer-hero-decoration deco-3">🌾</div>
        <div className="farmer-hero-inner">
          <div className="farmer-hero-icon-main">🌾</div>
          <div>
            <h1 className="farmer-hero-title">Farmer Advisory System</h1>
            <p className="farmer-hero-sub">AI-powered agricultural intelligence · Crop, Irrigation & Harvest Guidance</p>
          </div>
        </div>
        <form onSubmit={handleSearch} className="farmer-search-form">
          <input
            className="farmer-search-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city or region (e.g. Coimbatore, Punjab)"
          />
          <button type="submit" className="farmer-search-btn" disabled={loading}>
            {loading ? 'Analysing...' : 'Get Advisory'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="farmer-loading">
          <div className="farmer-loading-spinner" />
          <p>Fetching live weather data and generating agricultural advisory...</p>
        </div>
      )}

      {error && (
        <div className="page-wrapper">
          <div className="error-box">{error}</div>
        </div>
      )}

      {advisory && !loading && (
        <div className="page-wrapper">
          <div className="farmer-season-banner">
            <span className="season-icon">📅</span>
            <span>Current Season: <strong>{advisory.season}</strong></span>
            <span className="season-divider">|</span>
            <span>Region: <strong style={{ textTransform: 'capitalize' }}>{advisory.city}</strong></span>
            {advisory.droughtAlert && (
              <span className="drought-badge">🌵 DROUGHT ALERT</span>
            )}
          </div>

          <div className="farmer-weather-grid">
            <div className="farmer-weather-tile">
              <div className="fw-icon">🌡️</div>
              <div className="fw-value">{advisory.temperature.toFixed(1)}°C</div>
              <div className="fw-label">Temperature</div>
            </div>
            <div className="farmer-weather-tile">
              <div className="fw-icon">💧</div>
              <div className="fw-value">{advisory.humidity}%</div>
              <div className="fw-label">Humidity</div>
            </div>
            <div className="farmer-weather-tile">
              <div className="fw-icon">🌧️</div>
              <div className="fw-value">{advisory.precipitation.toFixed(2)} mm</div>
              <div className="fw-label">Precipitation</div>
            </div>
            <div className="farmer-weather-tile">
              <div className="fw-icon">💨</div>
              <div className="fw-value">{advisory.windSpeed.toFixed(1)} m/s</div>
              <div className="fw-label">Wind Speed</div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 className="farmer-section-title">🌱 Recommended Crops</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Based on current temperature, humidity, and seasonal conditions:
            </p>
            <div className="crop-tags-wrap">
              {advisory.recommendedCrops.map((crop, i) => (
                <CropTag key={i} crop={crop} />
              ))}
            </div>
          </div>

          <div className="farmer-cards-grid">
            <div className="farmer-detail-card" style={{ borderTopColor: '#3b82f6' }}>
              <div className="fdc-icon">💧</div>
              <div className="fdc-label">Irrigation Advice</div>
              <div className="fdc-value">{advisory.irrigationAdvice}</div>
            </div>
            <div className="farmer-detail-card" style={{ borderTopColor: advisory.harvestWarning.includes('CRITICAL') ? '#ef4444' : advisory.harvestWarning.includes('WARNING') ? '#f59e0b' : '#22c55e' }}>
              <div className="fdc-icon">🌾</div>
              <div className="fdc-label">Harvest Warning</div>
              <div className="fdc-value">{advisory.harvestWarning}</div>
            </div>
            <div className="farmer-detail-card" style={{ borderTopColor: '#8b5cf6' }}>
              <div className="fdc-icon">🌍</div>
              <div className="fdc-label">Soil Moisture</div>
              <div className="fdc-value">{advisory.soilMoistureStatus}</div>
            </div>
            <div className="farmer-detail-card" style={{ borderTopColor: '#f59e0b' }}>
              <div className="fdc-icon">🧪</div>
              <div className="fdc-label">Fertilizer Advice</div>
              <div className="fdc-value">{advisory.fertilizerRecommendation}</div>
            </div>
            <div className="farmer-detail-card" style={{ borderTopColor: advisory.pestRisk.startsWith('HIGH') ? '#ef4444' : advisory.pestRisk.startsWith('MEDIUM') ? '#f59e0b' : '#22c55e' }}>
              <div className="fdc-icon">🐛</div>
              <div className="fdc-label">Pest Risk</div>
              <div className="fdc-value">{advisory.pestRisk}</div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '20px' }}>
            <RiskBar score={advisory.riskScore} level={advisory.riskLevel} />
          </div>

          <div className="card">
            <h3 className="farmer-section-title">📊 Current Conditions Overview</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)', borderRadius: '10px', fontSize: '13px' }} />
                <Bar dataKey="value" fill="var(--accent)" radius={[6, 6, 0, 0]}
                  label={{ position: 'top', fontSize: 11, fill: 'var(--text-muted)' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}

export default FarmerAdvisoryPage