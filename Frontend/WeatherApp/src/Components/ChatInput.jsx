import React, { useState, useRef } from 'react'

const ChatInput = ({ onSend, disabled }) => {
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice input is not supported in your browser. Please use Chrome.')
      return
    }
    if (listening) {
      recognitionRef.current && recognitionRef.current.stop()
      setListening(false)
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setText((prev) => prev + (prev ? ' ' : '') + transcript)
      setListening(false)
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  return (
    <div className="chat-input-bar">
      <div className="chat-input-wrapper">
        <textarea
          className="chat-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about weather, farming, disasters, travel..."
          rows={1}
          disabled={disabled}
        />
        <button
          className={`chat-voice-btn ${listening ? 'chat-voice-active' : ''}`}
          onClick={handleVoice}
          title={listening ? 'Stop listening' : 'Voice input'}
        >
          🎤
        </button>
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={disabled || !text.trim()}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
      <p className="chat-input-hint">Press Enter to send · Shift+Enter for new line</p>
    </div>
  )
}

export default ChatInput