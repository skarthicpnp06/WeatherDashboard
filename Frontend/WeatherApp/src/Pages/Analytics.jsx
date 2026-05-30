import React, { useState, useEffect } from 'react'
import { getWeatherHistory } from '../Services/weatherservice'
import Errormessage from '../Components/Errormessage'
import Loader from '../Components/Loader'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const Analytics = ({ currentCity }) => {
  const [historyData, setHistoryData] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!currentCity) {
      setError("Please search for a city on the dashboard first to load its search trend analytics.")
      return
    }

    const fetchHistory = async () => {
      try {
        setLoading(true)
        setError("")
        const data = await getWeatherHistory(currentCity)
        
        const formattedData = data.map((item, index) => ({
          name: `Log #${index + 1}`,
          Temp: Math.round(item.temparature),
          Humidity: item.humidity,
          WindSpeed: item.windSpeed
        }))
  
        setHistoryData(formattedData)
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
      <div style={{ maxWidth: '600px', margin: '40px auto' }} className="glass-panel">
        <Errormessage message={error} />
      </div>
    )
  }

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div className="glass-panel">
        <h2 style={{ margin: '0 0 10px 0', fontSize: '26px', color: '#2c3e50' }}>Cache Insights: <span style={{ color: '#3498db', textTransform: 'capitalize' }}>{currentCity}</span></h2>
        
        {loading && <Loader />}
        {error && <Errormessage message={error} />}

        {!loading && !error && historyData.length === 0 && (
          <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>No historical metrics stored for this city yet.</p>
        )}

        {!loading && !error && historyData.length > 0 && (
          <div>
            <p style={{ color: '#7f8c8d', fontSize: '15px', margin: '0 0 25px 0' }}>Tracking data shifts captured across past searches in your database cache:</p>

            <div className="chart-wrapper">
              <h3 className="chart-title">Temperature Trajectory (°C)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={historyData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#334155' }} />
                  <Legend />
                  <Line type="monotone" dataKey="Temp" stroke="#e74c3c" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-wrapper" style={{ marginTop: '30px' }}>
              <h3 className="chart-title">Humidity vs Wind Speed Trends</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={historyData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#334155' }} />
                  <Legend />
                  <Bar dataKey="Humidity" fill="#3498db" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="WindSpeed" fill="#2ecc71" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analytics