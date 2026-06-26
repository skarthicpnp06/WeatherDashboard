import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { getDisasterAssessment, getDisasterHistory, getCityCoordinates } from '../Services/disasterService'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const RISK_CONFIG = {
  cycloneRisk: { icon: '🌀', label: 'Cyclone Risk' },
  floodRisk: { icon: '🌊', label: 'Flood Risk' },
  heatwaveRisk: { icon: '🔥', label: 'Heatwave Risk' },
  thunderstormRisk: { icon: '⛈️', label: 'Thunderstorm Risk' },
  landslideRisk: { icon: '⛰️', label: 'Landslide Risk' },
  heavyRainRisk: { icon: '🌧️', label: 'Heavy Rain Risk' },
}

const getRiskClass = (score) => {
  if (score >= 76) return 'risk-critical'
  if (score >= 51) return 'risk-danger'
  if (score >= 26) return 'risk-warning'
  return 'risk-safe'
}

const getRiskLabel = (score) => {
  if (score >= 76) return 'CRITICAL'
  if (score >= 51) return 'DANGER'
  if (score >= 26) return 'WARNING'
  return 'SAFE'
}

const getRiskColor = (score) => {
  if (score >= 76) return '#dc2626'
  if (score >= 51) return '#ea580c'
  if (score >= 26) return '#ca8a04'
  return '#16a34a'
}

const RiskCard = ({ icon, label, score }) => (
  <div className={`disaster-risk-card ${getRiskClass(score)}`}>
    <div className="drc-icon">{icon}</div>
    <div className="drc-label">{label}</div>
    <div className="drc-score" style={{ color: getRiskColor(score) }}>{score}</div>
    <div className="drc-level" style={{ color: getRiskColor(score) }}>{getRiskLabel(score)}</div>
    <div className="drc-bar-track">
      <div className="drc-bar-fill" style={{ width: `${score}%`, background: getRiskColor(score) }} />
    </div>
  </div>
)

const DisasterManagementPage = () => {
  const [city, setCity] = useState('')
  const [assessment, setAssessment] = useState(null)
  const [history, setHistory] = useState([])
  const [coords, setCoords] = useState({ lat: 20.5937, lon: 78.9629 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedInstruction, setExpandedInstruction] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!city.trim()) return
    setLoading(true)
    setError('')
    setAssessment(null)
    try {
      const [data, hist, coordData] = await Promise.all([
        getDisasterAssessment(city),
        getDisasterHistory(city).catch(() => []),
        getCityCoordinates(city),
      ])
      setAssessment(data)
      setHistory(hist)
      setCoords(coordData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const chartData = assessment
    ? Object.entries(RISK_CONFIG).map(([key, cfg]) => ({
        name: cfg.label.replace(' Risk', ''),
        score: assessment[key] || 0,
        fill: getRiskColor(assessment[key] || 0),
      }))
    : []

  return (
    <div className="disaster-page">
      <div className="disaster-hero">
        <div className="disaster-hero-deco deco-a">⚠️</div>
        <div className="disaster-hero-deco deco-b">🆘</div>
        <div className="disaster-hero-inner">
          <div className="disaster-hero-icon">🚨</div>
          <div>
            <h1 className="disaster-hero-title">Disaster Management Hub</h1>
            <p className="disaster-hero-sub">Real-time risk assessment · Emergency instructions · Live hazard map</p>
          </div>
        </div>
        <form onSubmit={handleSearch} className="disaster-search-form">
          <input
            className="disaster-search-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city to assess disaster risk..."
          />
          <button type="submit" className="disaster-search-btn" disabled={loading}>
            {loading ? 'Assessing...' : 'Assess Risk'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="disaster-loading">
          <div className="disaster-spinner" />
          <p>Calculating disaster risks from live weather data...</p>
        </div>
      )}

      {error && <div className="page-wrapper"><div className="error-box">{error}</div></div>}

      {!assessment && !loading && !error && (
        <div className="page-wrapper" style={{ maxWidth: '900px' }}>
          <div className="disaster-map-card">
            <h3 style={{ marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              India — Overview Map
            </h3>
            <div className="leaflet-map-container">
              <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                <CircleMarker center={[20.5937, 78.9629]} radius={20} fillColor="#3b82f6" color="white" weight={2} fillOpacity={0.5}>
                  <Popup>Search a city above to view disaster risk assessment</Popup>
                </CircleMarker>
              </MapContainer>
            </div>
          </div>
        </div>
      )}

      {assessment && !loading && (
        <div className="page-wrapper">
          <div className="disaster-overall-banner" style={{ borderColor: assessment.overallRiskColor, background: `${assessment.overallRiskColor}18` }}>
            <span className="dob-label">Overall Risk:</span>
            <span className="dob-level" style={{ color: assessment.overallRiskColor }}>{assessment.overallRiskLevel}</span>
            <span className="dob-score" style={{ color: assessment.overallRiskColor }}>Score {assessment.overallRiskScore}/100</span>
            {assessment.activeAlertTypes?.length > 0 && (
              <div className="dob-alerts">
                {assessment.activeAlertTypes.map((a, i) => (
                  <span key={i} className="dob-alert-tag">{a}</span>
                ))}
              </div>
            )}
          </div>

          <div className="disaster-risk-grid">
            {Object.entries(RISK_CONFIG).map(([key, cfg]) => (
              <RiskCard key={key} icon={cfg.icon} label={cfg.label} score={assessment[key] || 0} />
            ))}
          </div>

          <div className="disaster-map-card card">
            <h3 className="disaster-section-title">🗺️ Risk Location Map</h3>
            <div className="leaflet-map-container">
              <MapContainer center={[coords.lat, coords.lon]} zoom={10} style={{ height: '100%', width: '100%' }} key={`${coords.lat}-${coords.lon}`}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                <CircleMarker center={[coords.lat, coords.lon]} radius={Math.max(16, assessment.overallRiskScore / 4)} fillColor={assessment.overallRiskColor} color="white" weight={2.5} fillOpacity={0.65}>
                  <Popup>
                    <strong style={{ textTransform: 'capitalize' }}>{assessment.city}</strong><br />
                    Risk Level: <strong style={{ color: assessment.overallRiskColor }}>{assessment.overallRiskLevel}</strong><br />
                    Score: {assessment.overallRiskScore}/100
                  </Popup>
                </CircleMarker>
              </MapContainer>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 className="disaster-section-title">📊 Risk Score Comparison</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)', borderRadius: '10px', fontSize: '13px' }} />
                {chartData.map((entry, i) => (
                  <Bar key={i} dataKey="score" fill={entry.fill} radius={[6, 6, 0, 0]} />
                ))}
                <Bar dataKey="score" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {assessment.instructions && Object.keys(assessment.instructions).length > 0 && (
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 className="disaster-section-title">📋 Emergency Instructions</h3>
              <div className="instructions-list">
                {Object.entries(assessment.instructions).map(([type, instr], i) => (
                  <div key={i} className="instruction-item" onClick={() => setExpandedInstruction(expandedInstruction === i ? null : i)}>
                    <div className="instruction-header">
                      <span className="instruction-type">{type}</span>
                      <span className="instruction-toggle">{expandedInstruction === i ? '▲' : '▼'}</span>
                    </div>
                    {expandedInstruction === i && (
                      <div className="instruction-body fade-in">{instr}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {assessment.emergencyContacts && (
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 className="disaster-section-title">📞 Emergency Contacts</h3>
              <div className="emergency-contacts-grid">
                {Object.entries(assessment.emergencyContacts).map(([name, number], i) => (
                  <div key={i} className="emergency-contact-card">
                    <div className="ec-name">{name}</div>
                    <div className="ec-number">{number}</div>
                    <a href={`tel:${number}`} className="ec-call-btn">Call Now</a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="card">
              <h3 className="disaster-section-title">📜 Alert History</h3>
              <div className="disaster-history-table">
                <div className="dht-header">
                  <span>Alert Type</span>
                  <span>Severity</span>
                  <span>Risk Score</span>
                  <span>Date</span>
                </div>
                {history.slice(0, 10).map((h, i) => (
                  <div key={i} className="dht-row">
                    <span>{h.alertType}</span>
                    <span className={`severity-badge sev-${h.severity?.toLowerCase()}`}>{h.severity}</span>
                    <span>{h.riskScore}</span>
                    <span>{h.createdAt ? new Date(h.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DisasterManagementPage