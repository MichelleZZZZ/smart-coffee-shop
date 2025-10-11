'use client'
import { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCoffeeShopContext } from '@/lib/coffee-shop-content'
import ReactMarkdown from 'react-markdown'

export default function ChatPage() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{type: 'user' | 'assistant', content: string}>>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const askAI = async (customMessage?: string) => {
    const messageToSend = customMessage || message.trim()
    if (!messageToSend) return

    // Ensure we only send plain text strings
    const cleanMessage = typeof messageToSend === 'string' ? messageToSend : String(messageToSend)
    
    setMessage('')
    setLoading(true)
    
    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', content: cleanMessage }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: cleanMessage })
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

  const handleQuickQuestion = (question: string, answer: string) => {
    // Ensure we only work with plain strings
    const cleanQuestion = typeof question === 'string' ? question : String(question)
    const cleanAnswer = typeof answer === 'string' ? answer : String(answer)
    
    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', content: cleanQuestion }])
    
    // Add predefined answer immediately
    setMessages(prev => [...prev, { type: 'assistant', content: cleanAnswer }])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      askAI()
    }
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
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
          <Card className="min-h-[500px] max-h-[600px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle>Chat with our Coffee Assistant</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
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
                        {msg.type === 'user' ? (
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <div className="text-sm prose prose-sm max-w-none">
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                em: ({ children }) => <em className="italic">{children}</em>,
                                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                li: ({ children }) => <li className="text-sm">{children}</li>,
                                h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                                code: ({ children }) => <code className="bg-gray-300 px-1 py-0.5 rounded text-xs">{children}</code>,
                                blockquote: ({ children }) => <blockquote className="border-l-2 border-gray-400 pl-2 italic">{children}</blockquote>,
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        )}
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
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2 flex-shrink-0">
                <Input
                  value={message}
                  onChange={handleMessageChange}
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
                {
                  question: "What's on your menu?",
                  answer: "We have a full menu of **coffee drinks**, **specialty beverages**, and **food items**!\n\n**Coffee Drinks:**\n- Espresso: **$3.50**\n- Cappuccino: **$4.50**\n- Latte: **$5.00**\n- Caramel Macchiato: **$5.75**\n\n**Milk Options:**\n- Oat milk: +$0.75\n- Almond milk: +$0.50\n- Regular milk: included\n\nWe also offer pastries, sandwiches, and salads! ☕"
                },
                {
                  question: "What are your hours?",
                  answer: "**Store Hours:**\n- **Monday - Friday**: 7:00 AM - 7:00 PM\n- **Saturday - Sunday**: 8:00 AM - 6:00 PM\n\nPlease call ahead for holiday hours! 🕐"
                },
                {
                  question: "Do you have WiFi?",
                  answer: "Yes! We have **free WiFi** available for all customers.\n\n**WiFi Details:**\n- Password: `BrewCoffee123`\n- Power outlets at most tables\n- Designated quiet zones for work/study\n\nPerfect for remote work! 📡"
                },
                {
                  question: "What do you recommend?",
                  answer: "**My top recommendations:**\n\n1. **Ethiopian Yirgacheffe Pour Over** - **$4.75**\n   - Bright citrus notes, perfect for coffee connoisseurs\n\n2. **Vanilla Latte with Oat Milk** - **$6.00**\n   - Creamy and delicious, customer favorite\n\nBoth are absolutely amazing! ⭐"
                },
                {
                  question: "What are your prices?",
                  answer: "**Our Pricing:**\n\n**Coffee Drinks:**\n- Espresso: **$3.50**\n- Specialty drinks: **$4.00 - $5.75**\n\n**Food:**\n- Pastries: **$2.00 - $3.50**\n- Sandwiches: **$7.50**\n- Salads: **$8.00**\n\n**Special Offers:**\n- Loyalty program: Buy 10, get 1 free\n- Student/Senior discount: 10% off 💰"
                },
                {
                  question: "Do you have oat milk?",
                  answer: "Absolutely! We have **multiple milk alternatives**:\n\n- **Oat milk**: +$0.75 (creamy & dairy-free)\n- **Almond milk**: +$0.50\n- **Soy milk**: +$0.50\n- **Coconut milk**: +$0.75\n- **Regular milk**: included\n\nOat milk is perfect for lattes and cappuccinos! 🌾"
                }
              ].map((item) => (
                <Button
                  key={item.question}
                  variant="outline"
                  onClick={() => handleQuickQuestion(item.question, item.answer)}
                  className="text-left justify-start h-auto py-3 px-4"
                  disabled={loading}
                >
                  {item.question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}