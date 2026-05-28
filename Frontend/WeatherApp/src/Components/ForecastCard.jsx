import React from 'react'

const ForecastCard = ({ forecast }) => {
  return (
    <div className="forecast-card">
      <h3>{forecast.source}</h3> {/* We mapped the short date format string into the source property */}
      <div className="forecast-cond">{forecast.conditionName}</div>
      <div className="forecast-temp">{Math.round(forecast.temparature)}°C</div>
      <div className="forecast-sub">
        <span>💧 {forecast.humidity}%</span>
        <span>💨 {forecast.windspeed} km/h</span>
      </div>
    </div>
  )
}

export default ForecastCard