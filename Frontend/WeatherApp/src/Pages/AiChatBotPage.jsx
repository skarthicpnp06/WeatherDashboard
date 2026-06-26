import React, { useState, useRef } from 'react'
import ChatWindow from '../Components/ChatWindow'
import ChatInput from '../Components/ChatInput'
import SuggestedQuestions from '../Components/SuggestedQuestions'
import { sendChatMessage } from '../Services/chatService'

const AIChatbotPage = ({ currentCity }) => {
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [city, setCity] = useState(currentCity || '')
  const [error, setError] = useState('')

  const handleSend = async (text) => {
    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)
    setError('')
    try {
      const res = await sendChatMessage(text, city)
      const aiMsg = {
        role: 'ai',
        content: res.answer,
        timestamp: res.timestamp || new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      setError(err.message)
      const errMsg = {
        role: 'ai',
        content: 'I encountered an issue processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestion = (q) => handleSend(q)

  const clearChat = () => {
    setMessages([])
    setError('')
  }

  return (
    <div className="chatbot-page">
      <div className="chatbot-hero">
        <div className="chatbot-hero-blob blob-1" />
        <div className="chatbot-hero-blob blob-2" />
        <div className="chatbot-hero-content">
          <div className="chatbot-hero-icon">🤖</div>
          <div>
            <h1 className="chatbot-hero-title">SkySync AI Assistant</h1>
            <p className="chatbot-hero-sub">Powered by Anthropic Claude · Real-time Weather Intelligence</p>
          </div>
          <div className="chatbot-hero-controls">
            <input
              className="chatbot-city-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City context (optional)"
            />
            {messages.length > 0 && (
              <button className="chatbot-clear-btn" onClick={clearChat}>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <SuggestedQuestions onSelect={handleSuggestion} />

      {error && (
        <div className="chat-error-bar">{error}</div>
      )}

      <div className="chat-main-area">
        <ChatWindow messages={messages} isTyping={isTyping} />
      </div>

      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  )
}

export default AIChatbotPage