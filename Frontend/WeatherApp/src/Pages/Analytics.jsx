import React, { useState, useEffect } from 'react'
import { getWeatherHistory } from '../Services/weatherservice'
import Errormessage from '../Components/Errormessage'
import Loader from '../Components/Loader'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const Analytics = ({ currentCity }) => {
  const [historyData, setHistoryData] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  if (!currentCity) {
    return (
      <div className="page-wrapper" style={{ maxWidth: '700px' }}>
        <div className="card">
          <Errormessage message={error} />
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2 className="page-title">Analytics</h2>
        <p className="page-subtitle" style={{ textTransform: 'capitalize' }}>
          Historical search data for {currentCity}
        </p>

        {loading && <Loader />}
        {error && <Errormessage message={error} />}

        {!loading && !error && historyData.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', padding: '20px 0' }}>
            No historical data stored for this city yet.
          </p>
        )}

        {!loading && !error && historyData.length > 0 && (
          <>
            <div className="chart-block">
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

            <div className="chart-block">
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