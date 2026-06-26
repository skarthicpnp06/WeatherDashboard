import React, { useEffect, useRef } from 'react'
import ChatMessage from '../Pages/ChatMessage'

const TypingIndicator = () => (
  <div className="chat-message-row chat-row-ai">
    <div className="chat-avatar-ai"><span>🤖</span></div>
    <div className="typing-indicator">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  </div>
)

const ChatWindow = ({ messages, isTyping }) => {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="chat-window">
      {messages.length === 0 && (
        <div className="chat-empty-state fade-in">
          <div className="chat-empty-icon">🌦️</div>
          <h3 className="chat-empty-title">SkySync AI Weather Assistant</h3>
          <p className="chat-empty-desc">
            Ask about weather conditions, rain forecasts, farming advice, disaster risks, travel tips, or what to wear today.
          </p>
          <div className="chat-empty-features">
            <span className="chat-feature-pill">🌧️ Rain Prediction</span>
            <span className="chat-feature-pill">🌾 Farming Advice</span>
            <span className="chat-feature-pill">⚠️ Disaster Alerts</span>
            <span className="chat-feature-pill">✈️ Travel Tips</span>
            <span className="chat-feature-pill">👕 Clothing Guide</span>
            <span className="chat-feature-pill">🏥 Health Warnings</span>
          </div>
        </div>
      )}
      {messages.map((msg, i) => (
        <ChatMessage key={i} message={msg} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}

export default ChatWindow