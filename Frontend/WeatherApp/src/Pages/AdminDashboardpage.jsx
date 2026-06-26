import React, { useState } from 'react'
import { verifyAdminPassword, getAdminStats } from '../Services/adminService'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const PIE_COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#22c55e', '#8b5cf6', '#ec4899']

const StatCard = ({ icon, label, value, accent }) => (
  <div className="admin-stat-card" style={{ '--card-accent': accent }}>
    <div className="asc-top">
      <span className="asc-icon">{icon}</span>
      <span className="asc-label">{label}</span>
    </div>
    <div className="asc-number" style={{ color: accent }}>{value?.toLocaleString() ?? '—'}</div>
  </div>
)

const AdminDashboardPage = () => {
  const [password, setPassword] = useState('')
  const [isAuth, setIsAuth] = useState(false)
  const [stats, setStats] = useState(null)
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!password.trim()) return
    setLoading(true)
    setAuthError('')
    try {
      const valid = await verifyAdminPassword(password)
      if (valid) {
        setIsAuth(true)
        setStatsLoading(true)
        try {
          const data = await getAdminStats(password)
          setStats(data)
        } catch (err) {
          setStats(null)
        } finally {
          setStatsLoading(false)
        }
      } else {
        setAuthError('Invalid admin password. Please try again.')
      }
    } catch (err) {
      setAuthError('Authentication failed. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuth(false)
    setStats(null)
    setPassword('')
  }

  if (!isAuth) {
    return (
      <div className="admin-gate-page">
        <div className="admin-gate-card fade-in-up">
          <div className="admin-gate-icon">🔐</div>
          <h2 className="admin-gate-title">Admin Dashboard</h2>
          <p className="admin-gate-sub">Enter your admin credentials to access the analytics panel</p>
          <form onSubmit={handleLogin} className="admin-gate-form">
            <input
              type="password"
              className="input-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              autoFocus
            />
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
              {loading ? 'Verifying...' : 'Sign In'}
            </button>
          </form>
          {authError && <div className="alert-banner alert-error" style={{ marginTop: '16px' }}>{authError}</div>}
          <p className="admin-gate-hint">Set ADMIN_PASSWORD in your Render environment variables</p>
        </div>
      </div>
    )
  }

  if (statsLoading) {
    return (
      <div className="admin-page">
        <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: '80px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'float 2s ease-in-out infinite' }}>📊</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Loading analytics data...</p>
        </div>
      </div>
    )
  }

  const topCitiesData = stats?.topSearchedCities?.map((c) => ({ name: c.city, searches: Number(c.count) })) || []
  const alertFreqData = stats?.alertTypeFrequency?.map((a, i) => ({ name: a.type, value: Number(a.count), fill: PIE_COLORS[i % PIE_COLORS.length] })) || []

  return (
    <div className="admin-page">
      <div className="admin-hero">
        <div className="admin-hero-inner">
          <div>
            <h1 className="admin-hero-title">📊 Admin Analytics Dashboard</h1>
            <p className="admin-hero-sub">SkySync Intelligence Platform · Live System Statistics</p>
          </div>
          <div className="admin-hero-controls">
            <div className={`admin-db-badge ${stats?.databaseStatus === 'UP' ? 'db-up' : 'db-down'}`}>
              {stats?.databaseStatus === 'UP' ? '🟢 DB Connected' : '🔴 DB Offline'}
            </div>
            <button onClick={handleLogout} className="btn btn-ghost" style={{ fontSize: '13px' }}>Sign Out</button>
          </div>
        </div>
      </div>

      <div className="page-wrapper">
        <div className="admin-stats-grid">
          <StatCard icon="🔍" label="Total Searches" value={stats?.totalSearches} accent="#3b82f6" />
          <StatCard icon="🤖" label="Chat Requests" value={stats?.totalChatRequests} accent="#8b5cf6" />
          <StatCard icon="🔔" label="Active Alerts" value={stats?.totalActiveAlerts} accent="#f59e0b" />
          <StatCard icon="🌾" label="Farm Advisories" value={stats?.totalFarmerAdvisories} accent="#22c55e" />
          <StatCard icon="⚠️" label="Disaster Alerts" value={stats?.totalDisasterAlerts} accent="#ef4444" />
          <StatCard icon="🌆" label="Distinct Cities" value={stats?.distinctCities} accent="#0ea5e9" />
          <StatCard icon="👤" label="Registered Users" value={stats?.totalDistinctUsers} accent="#ec4899" />
          <StatCard icon="🗄️" label="DB Status" value={stats?.databaseStatus} accent={stats?.databaseStatus === 'UP' ? '#22c55e' : '#ef4444'} />
        </div>

        <div className="admin-charts-row">
          {topCitiesData.length > 0 && (
            <div className="card admin-chart-card">
              <h3 className="admin-section-title">🏙️ Top Searched Cities</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={topCitiesData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)', borderRadius: '10px', fontSize: '13px' }} />
                  <Bar dataKey="searches" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {alertFreqData.length > 0 && (
            <div className="card admin-chart-card">
              <h3 className="admin-section-title">🚨 Disaster Alert Types</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={alertFreqData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    {alertFreqData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)', borderRadius: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {stats?.recentChatHistory?.length > 0 && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 className="admin-section-title">💬 Recent Chat Requests</h3>
            <div className="admin-table">
              <div className="admin-table-header">
                <span>Question</span>
                <span>City</span>
                <span>Timestamp</span>
              </div>
              {stats.recentChatHistory.slice(0, 8).map((chat, i) => (
                <div key={i} className="admin-table-row fade-in">
                  <span className="admin-table-question">{chat.question}</span>
                  <span className="admin-table-city">{chat.city || 'N/A'}</span>
                  <span className="admin-table-time">{chat.timestamp ? new Date(chat.timestamp).toLocaleString() : '—'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats?.recentDisasterAlerts?.length > 0 && (
          <div className="card">
            <h3 className="admin-section-title">⚠️ Recent Disaster Alerts</h3>
            <div className="admin-table">
              <div className="admin-table-header">
                <span>City</span>
                <span>Alert Type</span>
                <span>Severity</span>
                <span>Risk Score</span>
                <span>Date</span>
              </div>
              {stats.recentDisasterAlerts.slice(0, 8).map((alert, i) => (
                <div key={i} className="admin-table-row fade-in">
                  <span style={{ textTransform: 'capitalize' }}>{alert.city}</span>
                  <span>{alert.alertType}</span>
                  <span className={`severity-badge sev-${alert.severity?.toLowerCase()}`}>{alert.severity}</span>
                  <span>{alert.riskScore}</span>
                  <span>{alert.createdAt ? new Date(alert.createdAt).toLocaleDateString() : '—'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboardPage