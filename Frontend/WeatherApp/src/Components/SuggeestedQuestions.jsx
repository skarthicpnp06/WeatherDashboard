import React from 'react'

const QUESTIONS = [
  "Will it rain today?",
  "What should I wear today?",
  "Is it safe to travel?",
  "Best crops to grow now?",
  "Is there flood risk?",
  "How is the air quality?",
  "Should I carry an umbrella?",
  "What is the heat index?",
  "Any cyclone warnings?",
  "Irrigation advice for farmers?",
]

const SuggestedQuestions = ({ onSelect }) => {
  return (
    <div className="suggested-questions-bar">
      <span className="suggested-label">Quick Ask:</span>
      <div className="suggested-scroll">
        {QUESTIONS.map((q, i) => (
          <button key={i} className="suggested-chip" onClick={() => onSelect(q)}>
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SuggestedQuestions