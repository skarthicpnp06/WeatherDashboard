import React from 'react'

const Errormessage = ({ message }) => {
  return (
    <div className="error-box">
      ⚠️ {message}
    </div>
  )
}

export default Errormessage