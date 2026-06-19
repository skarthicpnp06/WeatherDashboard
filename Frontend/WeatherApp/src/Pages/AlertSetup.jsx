import React, { useState } from 'react'
import { registerWeatherAlert, disableWeatherAlert } from '../Services/weatherservice'

const AlertSetup = () => {
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [targetTemp, setTargetTemp] = useState('')
  const [condition, setCondition] = useState('ABOVE')
  const [status, setStatus] = useState({ type: '', msg: '' })
  const [loading, setLoading] = useState(false)

  const [disableEmail, setDisableEmail] = useState('')
  const [disableCity, setDisableCity] = useState('')
  const [disableStatus, setDisableStatus] = useState({ type: '', msg: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !city || !targetTemp) {
      setStatus({ type: 'error', msg: 'All fields are required.' })
      return
    }
    setLoading(true)
    setStatus({ type: '', msg: '' })
    try {
      await registerWeatherAlert({ email: email.trim(), city: city.trim(), targetTemp: parseFloat(targetTemp), triggerCondition: condition })
      setStatus({ type: 'success', msg: `Alert activated for ${city.toUpperCase()} — triggers when temp goes ${condition.toLowerCase()} ${targetTemp}°C.` })
      setEmail('')
      setCity('')
      setTargetTemp('')
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to register alert. Check backend connection.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDisable = async (e) => {
    e.preventDefault()
    if (!disableEmail || !disableCity) {
      setDisableStatus({ type: 'error', msg: 'Both email and city are required.' })
      return
    }
    try {
      setDisableStatus({ type: '', msg: 'Processing...' })
      await disableWeatherAlert(disableEmail, disableCity)
      setDisableStatus({ type: 'success', msg: `Alert removed for ${disableCity.toUpperCase()} assigned to ${disableEmail}.` })
      setDisableEmail('')
      setDisableCity('')
    } catch (err) {
      setDisableStatus({ type: 'error', msg: 'Failed to disable alert. Verify email and city match your registered profile.' })
    }
  }

  return (
    <div className="page-wrapper" style={{ maxWidth: '580px' }}>
      <div className="card">
        <h2 className="page-title">Weather Alerts</h2>
        <p className="page-subtitle">Receive automated email notifications when temperature conditions are met.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="yourname@gmail.com" className="input-control" />
          </div>

          <div className="form-group">
            <label className="form-label">Target City</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Coimbatore" className="input-control" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Condition</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)} className="input-control">
                <option value="ABOVE">Goes ABOVE</option>
                <option value="BELOW">Drops BELOW</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Threshold (°C)</label>
              <input type="number" value={targetTemp} onChange={(e) => setTargetTemp(e.target.value)} placeholder="e.g. 32" className="input-control" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '4px' }}>
            {loading ? 'Activating...' : 'Activate Alert'}
          </button>
        </form>

        {status.msg && (
          <div className={`alert-banner ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {status.msg}
          </div>
        )}

        <hr className="divider" />

        <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--danger)', marginBottom: '6px' }}>
          Disable Alert
        </h3>
        <p className="page-subtitle" style={{ marginBottom: '16px' }}>
          Stop notifications for a specific registered profile.
        </p>

        <form onSubmit={handleDisable} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="email" value={disableEmail} onChange={(e) => setDisableEmail(e.target.value)} placeholder="Registered email address" className="input-control" />
          <input type="text" value={disableCity} onChange={(e) => setDisableCity(e.target.value)} placeholder="Registered city name" className="input-control" />
          <button type="submit" className="btn btn-danger">
            Disable Alert
          </button>
        </form>

        {disableStatus.msg && (
          <div className={`alert-banner ${disableStatus.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {disableStatus.msg}
          </div>
        )}
      </div>
    </div>
  )
}

export default AlertSetup