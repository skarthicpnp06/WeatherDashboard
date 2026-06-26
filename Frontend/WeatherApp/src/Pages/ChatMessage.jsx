import React from 'react'

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user'
  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div className={`chat-message-row ${isUser ? 'chat-row-user' : 'chat-row-ai'}`}>
      {!isUser && (
        <div className="chat-avatar-ai">
          <span style={{ fontSize: '18px' }}>🤖</span>
        </div>
      )}
      <div className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
        <div className="chat-bubble-text">{message.content}</div>
        {time && <div className="chat-bubble-time">{time}</div>}
      </div>
      {isUser && (
        <div className="chat-avatar-user">
          <span style={{ fontSize: '16px' }}>👤</span>
        </div>
      )}
    </div>
  )
}

export default ChatMessage