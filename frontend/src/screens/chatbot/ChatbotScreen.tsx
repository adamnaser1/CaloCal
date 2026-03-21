import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Mic, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { getCurrentUser } from '@/services/authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  action?: any
}

export default function ChatbotScreen() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your Calo Cal assistant 🤖 How can I help you today?',
      timestamp: new Date()
    }
  ])
  
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  const sendMessage = async () => {
    if (!input.trim() || loading) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    
    try {
      const user = await getCurrentUser()
      if (!user) {
         throw new Error('Not authenticated')
      }
      
      const response = await fetch(`${API_URL}/api/chat/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: input,
          user_id: user.id
        })
      })
      
      if (!response.ok) throw new Error('Chat request failed')
      
      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        action: data.action
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setConversationId(data.conversation_id)
      
      // Execute action if present
      if (data.action && data.action.type === 'add_meal') {
        // Show success message
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: '✅ Meal added to your diary!',
            timestamp: new Date()
          }])
        }, 1000)
      }
      
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
    }
  }
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }
  
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Calo Cal Assistant</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Always here to help 🤖</p>
        </div>
      </header>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-[#F5C518] text-white'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-yellow-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-[#F5C518]"
            disabled={loading}
          />
          
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-12 h-12 rounded-full bg-[#F5C518] text-white
                     flex items-center justify-center hover:bg-yellow-500
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Quick actions */}
        <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setInput('What should I eat for dinner?')}
            className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm
                     hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
          >
            🍽️ Dinner ideas
          </button>
          <button
            onClick={() => setInput('I ate a brik for breakfast')}
            className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm
                     hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
          >
            ➕ Log meal
          </button>
          <button
            onClick={() => setInput('How am I doing today?')}
            className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm
                     hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
          >
            📊 My stats
          </button>
        </div>
      </div>
    </div>
  )
}
