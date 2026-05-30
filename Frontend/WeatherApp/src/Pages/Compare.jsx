import React, { useState } from 'react'
import { getWeatherData } from '../Services/weatherservice'
import WeatherCard from '../Components/WeatherCard'
import Loader from '../Components/Loader'
import Errormessage from '../Components/Errormessage'

const Compare = () => {
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
      const res1 = await getWeatherData(city1)
      const res2 = await getWeatherData(city2)
      setData1(res1)
      setData2(res2)
    } catch (err) {
      setError("Could not complete city metrics side-by-side verification: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="glass-panel">
        <h2 style={{ color: '#2c3e50', textAlign: 'center', margin: '0 0 25px 0', fontSize: '26px' }}>Side-by-Side City Comparison</h2>
        
        <form onSubmit={handleCompare} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '10px' }}>
          <input 
            type="text" 
            value={city1} 
            onChange={(e) => setCity1(e.target.value)} 
            placeholder="First City..." 
            className="input-control"
            style={{ maxWidth: '250px' }}
          />
          <input 
            type="text" 
            value={city2} 
            onChange={(e) => setCity2(e.target.value)} 
            placeholder="Second City..." 
            className="input-control"
            style={{ maxWidth: '250px' }}
          />
          <button type="submit" className="btn-primary">
            Compare Metrics
          </button>
        </form>

        {loading && <Loader />}
        {error && <Errormessage message={error} />}

        {!loading && !error && (data1 || data2) && (
          <div className="compare-layout">
            <div className="compare-col">
              {data1 && <WeatherCard weather={data1} />}
            </div>
            <div className="compare-col">
              {data2 && <WeatherCard weather={data2} />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Compare