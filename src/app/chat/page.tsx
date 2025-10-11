'use client'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChatPage() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{type: 'user' | 'assistant', content: string}>>([])
  const [loading, setLoading] = useState(false)

  const askAI = async () => {
    if (!message.trim()) return

    const userMessage = message.trim()
    setMessage('')
    setLoading(true)
    
    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', content: userMessage }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Add assistant response to chat
      setMessages(prev => [...prev, { type: 'assistant', content: data.reply }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: 'Sorry, something went wrong! Please try again.' 
      }])
    }
    setLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      askAI()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-amber-900 to-amber-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">☕ Coffee Assistant</h1>
          <p className="text-xl text-amber-100">
            Ask me anything about coffee, our menu, or store hours!
          </p>
        </div>
      </section>

      {/* Chat Interface */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-8">
          <Card className="h-96 flex flex-col">
            <CardHeader>
              <CardTitle>Chat with our Coffee Assistant</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>👋 Hi! I'm your coffee assistant. Ask me anything!</p>
                    <p className="text-sm mt-2">Try asking about our menu, hours, or coffee recommendations.</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.type === 'user'
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about coffee, menu, hours..."
                  className="flex-1"
                  disabled={loading}
                />
                <Button
                  onClick={askAI}
                  disabled={loading || !message.trim()}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {loading ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Questions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                "What's on your menu?",
                "What are your hours?",
                "Do you have WiFi?",
                "What do you recommend?",
                "What are your prices?",
                "Do you have oat milk?"
              ].map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  onClick={() => setMessage(question)}
                  className="text-left justify-start h-auto py-3 px-4"
                  disabled={loading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}