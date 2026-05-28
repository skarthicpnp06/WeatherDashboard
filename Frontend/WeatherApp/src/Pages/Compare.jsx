import React, { useState } from 'react'
import { getWeatherData } from '../Services/weatherservice'
import WeatherCard from '../Components/WeatherCard'

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
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>⚔️ Side-by-Side City Comparison</h2>
      
      <form onSubmit={handleCompare} style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
        <input 
          type="text" 
          value={city1} 
          onChange={(e) => setCity1(e.target.value)} 
          placeholder="First City..." 
          style={{ padding: '10px', borderRadius: '5px', border: 'none', width: '200px' }}
        />
        <input 
          type="text" 
          value={city2} 
          onChange={(e) => setCity2(e.target.value)} 
          placeholder="Second City..." 
          style={{ padding: '10px', borderRadius: '5px', border: 'none', width: '200px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#28a745', color: 'white', cursor: 'pointer' }}>
          Compare Metrics
        </button>
      </form>

      {loading && <p style={{ color: 'white', textAlign: 'center' }}>Syncing comparative dimensions...</p>}
      {error && <p style={{ color: '#ff6b6b', textAlign: 'center' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {data1 && <div style={{ flex: '1', minWidth: '300px' }}><WeatherCard weather={data1} /></div>}
        {data2 && <div style={{ flex: '1', minWidth: '300px' }}><WeatherCard weather={data2} /></div>}
      </div>
    </div>
  )
}

export default Compare