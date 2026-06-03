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
  const [disableStatus, setDisableStatus] = useState('')

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

  const handleDisableAlert = async (e) => {
    e.preventDefault()
    if (!disableEmail || !disableCity) {
      setDisableStatus('⚠️ Please enter both your registered email and target city.')
      return
    }

    try {
      setDisableStatus('Processing removal requests...')
      await disableWeatherAlert(disableEmail, disableCity)
      setDisableStatus(`✨ Success! Alert monitoring removed for ${disableCity.toUpperCase()} assigned to ${disableEmail}.`)
      setDisableEmail('')
      setDisableCity('')
    } catch (err) {
      setDisableStatus('❌ Failed to disable alert. Confirm email/city parameters match database records.')
    }
  }

  return (
    <div style={{ maxWidth: '550px', margin: '40px auto' }}>
      <div className="glass-panel">
        <h2 style={{ textAlign: 'center', margin: '0 0 10px 0', fontSize: '26px' }}>Configure Weather Alerts</h2>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#7f8c8d', marginBottom: '30px' }}>
          Receive automated email dispatches when conditions break past your preferred metrics.
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
                <option value="ABOVE">Goes ABOVE</option>
                <option value="BELOW">Drops BELOW</option>
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

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '40px 0 30px 0' }} />

        <h3 style={{ textAlign: 'center', margin: '0 0 10px 0', fontSize: '20px', color: '#e74c3c' }}>🛑 Disable Active Alerts</h3>
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#7f8c8d', marginBottom: '20px' }}>
          Stop receiving background notifications for a specific profile setup instantly.
        </p>

        <form onSubmit={handleDisableAlert} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="form-group">
            <input 
              type="email" 
              value={disableEmail} 
              onChange={(e) => setDisableEmail(e.target.value)} 
              placeholder="Enter registered email address..." 
              className="input-control" 
            />
          </div>
          <div className="form-group">
            <input 
              type="text" 
              value={disableCity} 
              onChange={(e) => setDisableCity(e.target.value)} 
              placeholder="Enter assigned city name..." 
              className="input-control" 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ background: '#e74c3c' }}>
            Turn Off Alert Track
          </button>
        </form>

        {disableStatus && (
          <p style={{ marginTop: '15px', padding: '10px', background: 'rgba(231,76,60,0.1)', borderRadius: '6px', fontSize: '13px', textAlign: 'center', fontWeight: '500' }}>
            {disableStatus}
          </p>
        )}
      </div>
    </div>
  )
}

export default AlertSetup