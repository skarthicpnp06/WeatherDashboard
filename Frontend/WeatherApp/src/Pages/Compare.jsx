import React, { useState } from 'react'
import { getWeatherData } from '../Services/weatherservice.js'
import WeatherCard from '../Components/WeatherCard.jsx'
import Loader from '../Components/Loader.jsx'
import Errormessage from '../Components/Errormessage.jsx'

const Compare = ({ isCelsius, isMetersPerSecond }) => {
  const [city1, setCity1] = useState('')
  const [city2, setCity2] = useState('')
  const [data1, setData1] = useState(null)
  const [data2, setData2] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleCompare = async (e) => {
    e.preventDefault()
    if (!city1.trim() || !city2.trim()) return
    setLoading(true)
    setError(null)
    try {
      const [res1, res2] = await Promise.all([getWeatherData(city1), getWeatherData(city2)])
      setData1(res1)
      setData2(res2)
    } catch (err) {
      setError("Could not fetch comparison data: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2 className="page-title">City Comparison</h2>
        <p className="page-subtitle">Compare live weather metrics between two cities side by side.</p>

        <form onSubmit={handleCompare} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label className="form-label">First City</label>
            <input type="text" value={city1} onChange={(e) => setCity1(e.target.value)} placeholder="e.g. Mumbai" className="input-control" />
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label className="form-label">Second City</label>
            <input type="text" value={city2} onChange={(e) => setCity2(e.target.value)} placeholder="e.g. Delhi" className="input-control" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Compare
          </button>
        </form>

        {loading && <Loader />}
        {error && <Errormessage message={error} />}

        {!loading && !error && (data1 || data2) && (
          <div className="compare-grid">
            <div className="card-sm">
              {data1 && <WeatherCard weather={data1} isCelsius={isCelsius} isMetersPerSecond={isMetersPerSecond} />}
            </div>
            <div className="card-sm">
              {data2 && <WeatherCard weather={data2} isCelsius={isCelsius} isMetersPerSecond={isMetersPerSecond} />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Compare