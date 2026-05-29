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
      setStatus({ type: 'error', msg: 'Please fill out all alert registration fields.' })
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
      setStatus({ type: 'success', msg: `Success! Alerts armed for ${city.toUpperCase()} when temp goes ${condition.toLowerCase()} ${targetTemp}°C.` })
      setEmail('')
      setCity('')
      setTargetTemp('')
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to configure alert configuration profile. Check backend connection.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '550px', margin: '40px auto' }}>
      <div className="glass-panel">
        <h2 style={{ textAlign: 'center', margin: '0 0 10px 0', fontSize: '26px' }}>⏰ Configure Weather Alerts</h2>
        <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '30px' }}>
          Receive real-time automated email dispatches when the automated engine scans conditions mapping your metrics.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="yourname@gmail.com" className="input-control" />
          </div>

          <div className="form-group">
            <label className="form-label">Target City</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Coimbatore" className="input-control" />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group" style={{ flex: '1' }}>
              <label className="form-label">Condition</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)} className="input-control">
                <option value="ABOVE">Goes ABOVE (📈)</option>
                <option value="BELOW">Drops BELOW (📉)</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: '1' }}>
              <label className="form-label">Threshold Target (°C)</label>
              <input type="number" value={targetTemp} onChange={(e) => setTargetTemp(e.target.value)} placeholder="e.g. 32" className="input-control" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '10px' }}>
            {loading ? 'Processing Dispatch Setup...' : 'Activate Alarm Trigger'}
          </button>
        </form>

        {status.msg && (
          <div className={`alert-status ${status.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
            {status.msg}
          </div>
        )}
      </div>
    </div>
  )
}

export default AlertSetup