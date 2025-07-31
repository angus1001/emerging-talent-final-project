"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(true) // 连接状态
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your investment assistant. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    },
    {
      id: '2',
      content: 'I can help you with portfolio analysis, stock information, market trends, and investment advice. What would you like to know?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100) // 小延迟确保DOM已更新
    }
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // 测试API连接
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('http://47.96.76.43:3080/health', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.status === 200) {
          setIsConnected(true)
        } else {
          setIsConnected(false)
        }
      } catch (error) {
        setIsConnected(false)
      }
    }

    // 只在聊天框打开时测试连接
    if (isOpen) {
      testConnection()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInputMessage = inputMessage
    setInputMessage('')
    setIsTyping(true)

    try {
      // 调用真实的聊天机器人API
      const response = await fetch('http://47.96.76.43:3080', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInputMessage
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setIsConnected(true) // API调用成功，更新连接状态
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message || 'Sorry, I didn\'t receive a proper response.',
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error calling chatbot API:', error)
      setIsConnected(false) // API调用失败，更新连接状态
      
      // 如果API调用失败，显示错误消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I\'m having trouble connecting to the AI service right now. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* 聊天窗口 */}
      {isOpen && (
        <div className="fixed bottom-28 right-4 z-50 w-80 h-96 animate-in slide-in-from-bottom-2 slide-in-from-right-2">
          <Card className="h-full flex flex-col shadow-lg border">
            <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#2fb56e] text-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <div className="flex flex-col">
                  <CardTitle className="text-sm font-medium">Investment Assistant</CardTitle>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-xs opacity-75">
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="h-6 w-6 p-0 text-white hover:bg-[#26a065]"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* 消息区域 */}
              <div 
                className="flex-1 overflow-y-auto p-4 max-h-[300px]"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#CBD5E0 #F7FAFC'
                }}
              >
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-2 ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.sender === 'bot' && (
                        <div className="w-6 h-6 rounded-full bg-[#2fb56e] flex items-center justify-center flex-shrink-0">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] p-3 rounded-lg text-sm ${
                          message.sender === 'user'
                            ? 'bg-[#2fb56e] text-white ml-auto'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className={`text-xs mt-1 opacity-70`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      {message.sender === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
                          <User className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* 正在输入指示器 */}
                  {isTyping && (
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 rounded-full bg-[#2fb56e] flex items-center justify-center flex-shrink-0">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* 输入区域 */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="输入您的问题..."
                    disabled={isTyping}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    size="sm"
                    className="px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 悬浮按钮 */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-[#2fb56e] hover:bg-[#26a065] shadow-lg"
        size="lg"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </Button>
    </>
  )
}
