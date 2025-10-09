'use client'
import { useState } from 'react'

export default function ChatPage() {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)

  const askAI = async () => {
    if (!message) return
    
    setLoading(true)
    setReply('') // Clear previous reply
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setReply(data.reply)
    } catch (error) {
      console.error('Chat error:', error)
      setReply('Sorry, something went wrong! Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>☕ Coffee Assistant</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about coffee..."
          style={{ 
            padding: '10px', 
            width: '70%', 
            marginRight: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button 
          onClick={askAI}
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            background: '#8B4513',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </div>

      {reply && (
        <div style={{ 
          padding: '15px', 
          background: '#f5f5f5', 
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <strong>Assistant:</strong> {reply}
        </div>
      )}

      
    </div>
  )
}