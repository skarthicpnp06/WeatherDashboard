import React, { useState } from 'react'
import { getWeatherData } from '../Services/weatherservice.js'
import Loader from '../Components/Loader.jsx'
import Errormessage from '../Components/Errormessage.jsx'

const METRICS = [
  { key: 'temparature', label: '🌡️ Temperature', unit: (c) => `${c}°C`, altUnit: (c) => `${Math.round((c * 9) / 5 + 32)}°F`, lowerBetter: false },
  { key: 'feelsLike', label: '🤔 Feels Like', unit: (c) => `${c}°C`, altUnit: (c) => `${Math.round((c * 9) / 5 + 32)}°F`, lowerBetter: false },
  { key: 'humidity', label: '💧 Humidity', unit: (v) => `${v}%`, altUnit: (v) => `${v}%`, lowerBetter: false },
  { key: 'windSpeed', label: '💨 Wind Speed', unit: (v) => `${v.toFixed(1)} m/s`, altUnit: (v) => `${(v * 3.6).toFixed(1)} km/h`, lowerBetter: true },
  { key: 'precipitation', label: '🌧️ Precipitation', unit: (v) => `${v.toFixed(2)} mm`, altUnit: (v) => `${v.toFixed(2)} mm`, lowerBetter: true },
  { key: 'aqi', label: '🍃 AQI Level', unit: (v) => `${v}`, altUnit: (v) => `${v}`, lowerBetter: true },
  { key: 'description', label: '☁️ Condition', unit: (v) => v, altUnit: (v) => v, isText: true },
]

const AQI_LABELS = { 1: 'Good', 2: 'Fair', 3: 'Moderate', 4: 'Poor', 5: 'Hazardous' }

const getDiff = (v1, v2, metric) => {
  if (metric.isText) return { label: '—', cls: 'vs-diff-neutral', arrow: '' }
  const raw1 = parseFloat(v1)
  const raw2 = parseFloat(v2)
  if (isNaN(raw1) || isNaN(raw2)) return { label: '—', cls: 'vs-diff-neutral', arrow: '' }
  const diff = raw1 - raw2
  if (Math.abs(diff) < 0.01) return { label: 'Equal', cls: 'vs-diff-equal', arrow: '=' }
  const diffStr = Math.abs(diff).toFixed(diff % 1 === 0 ? 0 : 1)
  if (diff > 0) return { label: `+${diffStr}`, cls: 'vs-diff-up', arrow: '▲' }
  return { label: `-${diffStr}`, cls: 'vs-diff-down', arrow: '▼' }
}

const getWinner = (v1, v2, metric) => {
  if (metric.isText) return null
  const raw1 = parseFloat(v1), raw2 = parseFloat(v2)
  if (isNaN(raw1) || isNaN(raw2) || raw1 === raw2) return null
  if (metric.lowerBetter) return raw1 < raw2 ? 'city1' : 'city2'
  return raw1 > raw2 ? 'city1' : 'city2'
}

const displayVal = (weather, metric, isCelsius, isMetersPerSecond) => {
  const raw = weather[metric.key]
  if (raw === undefined || raw === null) return 'N/A'
  if (metric.key === 'aqi') return `${AQI_LABELS[raw] || raw} (${raw})`
  if (metric.key === 'temparature' || metric.key === 'feelsLike') {
    return isCelsius ? `${Math.round(raw)}°C` : `${Math.round((raw * 9) / 5 + 32)}°F`
  }
  if (metric.key === 'windSpeed') {
    return isMetersPerSecond ? `${raw.toFixed(1)} m/s` : `${(raw * 3.6).toFixed(1)} km/h`
  }
  return metric.unit(raw)
}

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
      setError('Could not fetch comparison data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2 className="page-title">⚡ City Comparison</h2>
        <p className="page-subtitle">Compare live weather metrics between two cities side by side.</p>

        <form onSubmit={handleCompare} className="compare-search-form">
          <div className="compare-input-group">
            <span className="compare-city-badge city-badge-1">City 1</span>
            <input type="text" value={city1} onChange={(e) => setCity1(e.target.value)} placeholder="e.g. Chennai" className="input-control" />
          </div>
          <div className="compare-vs-label">VS</div>
          <div className="compare-input-group">
            <span className="compare-city-badge city-badge-2">City 2</span>
            <input type="text" value={city2} onChange={(e) => setCity2(e.target.value)} placeholder="e.g. Mumbai" className="input-control" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>Compare</button>
        </form>

        {loading && <Loader />}
        {error && <Errormessage message={error} />}

        {!loading && !error && data1 && data2 && (
          <div className="compare-results fade-in-up">
            <div className="compare-cards-row">
              <div className="compare-weather-mini card-sm">
                <div className="cwm-city">{data1.city}</div>
                <div className="cwm-temp">{isCelsius ? `${Math.round(data1.temparature)}°C` : `${Math.round((data1.temparature * 9) / 5 + 32)}°F`}</div>
                <div className="cwm-desc">{data1.description}</div>
                <div className="cwm-source">{data1.apiSource}</div>
              </div>
              <div className="compare-middle-badge">VS</div>
              <div className="compare-weather-mini card-sm">
                <div className="cwm-city">{data2.city}</div>
                <div className="cwm-temp">{isCelsius ? `${Math.round(data2.temparature)}°C` : `${Math.round((data2.temparature * 9) / 5 + 32)}°F`}</div>
                <div className="cwm-desc">{data2.description}</div>
                <div className="cwm-source">{data2.apiSource}</div>
              </div>
            </div>

            <div className="vs-table-wrapper">
              <div className="vs-table-head">
                <span className="vs-th vs-th-metric">Metric</span>
                <span className="vs-th vs-th-city" style={{ color: '#3b82f6' }}>{data1.city?.toUpperCase()}</span>
                <span className="vs-th vs-th-diff">Difference</span>
                <span className="vs-th vs-th-city" style={{ color: '#8b5cf6' }}>{data2.city?.toUpperCase()}</span>
              </div>

              {METRICS.map((metric, i) => {
                const v1 = data1[metric.key]
                const v2 = data2[metric.key]
                const diff = getDiff(v1, v2, metric)
                const winner = getWinner(v1, v2, metric)
                return (
                  <div key={i} className={`vs-table-row ${i % 2 === 0 ? 'vs-row-even' : ''}`}>
                    <span className="vs-td vs-metric-name">{metric.label}</span>
                    <span className={`vs-td vs-city-val ${winner === 'city1' ? 'vs-winner-cell' : ''}`}>
                      {winner === 'city1' && <span className="vs-winner-star">★</span>}
                      {displayVal(data1, metric, isCelsius, isMetersPerSecond)}
                    </span>
                    <span className={`vs-td vs-diff-cell ${diff.cls}`}>
                      {diff.arrow && <span className="vs-arrow">{diff.arrow}</span>}
                      {diff.label}
                    </span>
                    <span className={`vs-td vs-city-val ${winner === 'city2' ? 'vs-winner-cell vs-winner-right' : ''}`}>
                      {winner === 'city2' && <span className="vs-winner-star">★</span>}
                      {displayVal(data2, metric, isCelsius, isMetersPerSecond)}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="vs-legend">
              <span className="vs-legend-item"><span className="vs-winner-star">★</span> Better value for comfort</span>
              <span className="vs-legend-item"><span style={{ color: '#22c55e' }}>▲</span> City 1 higher</span>
              <span className="vs-legend-item"><span style={{ color: '#ef4444' }}>▼</span> City 1 lower</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Compare