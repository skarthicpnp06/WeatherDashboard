import React, { useState } from 'react'
import { registerWeatherAlert } from '../Services/weatherservice'

const AlertSetup = () => {
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [targetTemp, setTargetTemp] = useState('')
  const [condition, setCondition] = useState('ABOVE')
  const [status, setStatus] = useState({ type: '', msg: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !city || !targetTemp) {
      setStatus({ type: 'error', msg: 'Please fill out all alert registration boxes.' })
      return
    }

    setLoading(true)
    setStatus({ type: '', msg: '' })

    const payload = {
      email: email.trim(),
      city: city.trim(),
      targetTemp: parseFloat(targetTemp),
      triggerCondition: condition
    }

    try {
      await registerWeatherAlert(payload)
      setStatus({ type: 'success', msg: `Success! Alerts armed for ${city.toUpperCase()} when temp is ${condition.toLowerCase()} ${targetTemp}°C.` })
      setEmail('')
      setCity('')
      setTargetTemp('')
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to create alert profile. Check connection.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '30px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '15px', color: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>⏰ Configure Weather Alerts</h2>
      <p style={{ textAlign: 'center', fontSize: '14px', color: '#eee', marginBottom: '25px' }}>Get immediate email dispatches every time our background scanner runs if criteria parameters are met.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="yourname@gmail.com" style={styles.inputField} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Target City</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Coimbatore" style={styles.inputField} />
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: '1' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Condition</label>
            <select value={condition} onChange={(e) => setCondition(e.target.value)} style={styles.inputField}>
              <option value="ABOVE" style={{color: 'black'}}>Goes ABOVE (📈)</option>
              <option value="BELOW" style={{color: 'black'}}>Drops BELOW (📉)</option>
            </select>
          </div>
          <div style={{ flex: '1' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Temp Threshold (°C)</label>
            <input type="number" value={targetTemp} onChange={(e) => setTargetTemp(e.target.value)} placeholder="e.g. 32" style={styles.inputField} />
          </div>
        </div>

        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? 'Processing Registration...' : 'Activate Alarm Trigger'}
        </button>
      </form>

      {status.msg && (
        <div style={{ marginTop: '20px', padding: '12px', borderRadius: '8px', textAlign: 'center', backgroundColor: status.type === 'success' ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
          {status.msg}
        </div>
      )}
    </div>
  )
}

const styles = {
  inputField: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    boxSizing: 'border-box',
    fontSize: '15px'
  },
  submitBtn: {
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#ffc107',
    color: '#111',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  }
}

export default AlertSetup