import React, { useState, useEffect } from 'react'
import { getWeatherHistory, getAnalyticsSummary } from '../Services/weatherservice'
import Errormessage from '../Components/Errormessage'
import Loader from '../Components/Loader'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const Analytics = ({ currentCity }) => {
  const [historyData, setHistoryData] = useState([])
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getAnalyticsSummary()
        setSummary(data)
      } catch {
        setSummary(null)
      }
    }
    fetchSummary()
  }, [])

  useEffect(() => {
    if (!currentCity) {
      setError('Search for a city on the Current Weather tab first.')
      return
    }
    const fetchHistory = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getWeatherHistory(currentCity)
        const formatted = data.map((item, i) => ({
          name: `#${i + 1}`,
          Temp: Math.round(item.temparature),
          Humidity: item.humidity,
          WindSpeed: parseFloat(item.windSpeed.toFixed(1))
        }))
        setHistoryData(formatted)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [currentCity])

  return (
    <div className="page-wrapper fade-in">
      {summary && (
        <div className="metric-summary-grid">
          <div className="metric-summary-card">
            <div className="metric-summary-label">Total Searches</div>
            <div className="metric-summary-value">{summary.totalSearches}</div>
          </div>
          <div className="metric-summary-card">
            <div className="metric-summary-label">Distinct Cities</div>
            <div className="metric-summary-value">{summary.distinctCities}</div>
          </div>
          <div className="metric-summary-card">
            <div className="metric-summary-label">Active Alerts</div>
            <div className="metric-summary-value">{summary.activeAlerts}</div>
          </div>
          <div className="metric-summary-card">
            <div className="metric-summary-label">Top Region</div>
            <div className="metric-summary-value" style={{ textTransform: 'capitalize', fontSize: '20px' }}>
              {summary.topCities && summary.topCities.length > 0 ? summary.topCities[0].city : 'N/A'}
            </div>
          </div>
        </div>
      )}

      {summary && summary.topCities && summary.topCities.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 className="chart-title" style={{ marginBottom: '14px' }}>Top Active Search Regions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {summary.topCities.map((c, idx) => (
              <div key={idx} className="top-city-row">
                <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{idx + 1}. {c.city}</span>
                <span className="source-badge">{c.count} searches</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="page-title">Search History</h2>
        <p className="page-subtitle" style={{ textTransform: 'capitalize' }}>
          {currentCity ? `Historical data for ${currentCity}` : 'No city selected'}
        </p>

        {loading && <Loader />}
        {error && <Errormessage message={error} />}

        {!loading && !error && historyData.length === 0 && currentCity && (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', padding: '20px 0' }}>
            No historical data stored for this city yet.
          </p>
        )}

        {!loading && !error && historyData.length > 0 && (
          <>
            <div className="chart-block fade-in-up">
              <div className="chart-title">Temperature Trend (°C)</div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={historyData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '13px' }} />
                  <Legend wrapperStyle={{ fontSize: '13px' }} />
                  <Line type="monotone" dataKey="Temp" stroke="var(--accent)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-block fade-in-up">
              <div className="chart-title">Humidity & Wind Speed</div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={historyData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '13px' }} />
                  <Legend wrapperStyle={{ fontSize: '13px' }} />
                  <Bar dataKey="Humidity" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="WindSpeed" fill="#6b7280" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Analytics