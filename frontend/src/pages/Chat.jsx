import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import Navbar from '../components/Navbar'
import {
    Sparkles,
    Send,
    Upload,
    Download,
    ArrowLeft,
    Bot,
    User as UserIcon
} from 'lucide-react'

export default function Chat() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(null)
    const messagesEndRef = useRef(null)
    const fileInputRef = useRef(null)

    useEffect(() => {
        // Initial greeting from AI
        setMessages([
            {
                role: 'assistant',
                content: 'Hello! 👋 I\'m your LoanFlow AI assistant. I\'m here to help you get a personal loan quickly and easily. Let\'s start by getting to know you better. What\'s your name?'
            }
        ])
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSend = async () => {
        if (!input.trim() && !file) return

        const userMessage = {
            role: 'user',
            content: input,
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            // Send message to backend
            const response = await axios.post('/api/chat', {
                message: input,
                user_id: user.id,
                has_file: !!file
            })

            const aiMessage = {
                role: 'assistant',
                content: response.data.response,
                data: response.data.data
            }

            setMessages(prev => [...prev, aiMessage])

            // If file was uploaded, clear it
            if (file) {
                setFile(null)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }
            }
        } catch (error) {
            console.error('Error sending message:', error)
            const errorMessage = {
                role: 'assistant',
                content: 'I apologize, but I encountered an error. Please make sure the backend server is running and try again.'
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            setFile(selectedFile)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800 flex flex-col">
            <Navbar />

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}
                        >
                            <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                {/* Avatar */}
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user'
                                    ? 'bg-white text-primary-700'
                                    : 'bg-gradient-to-r from-primary-500 to-purple-500 text-white'
                                    }`}>
                                    {message.role === 'user' ? (
                                        <UserIcon className="w-5 h-5" />
                                    ) : (
                                        <Bot className="w-5 h-5" />
                                    )}
                                </div>

                                {/* Message Bubble */}
                                <div className={message.role === 'user' ? 'message-user' : 'message-ai'}>
                                    <p className="whitespace-pre-wrap">{message.content}</p>

                                    {/* Download button for sanction letter */}
                                    {message.data?.sanction_letter_url && (
                                        <a
                                            href={message.data.sanction_letter_url}
                                            download
                                            className="mt-3 inline-flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span>Download Sanction Letter</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start animate-slideIn">
                            <div className="flex items-start space-x-2 max-w-[80%]">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 text-white flex items-center justify-center">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div className="message-ai">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="glass border-t border-white/10 p-4">
                <div className="max-w-4xl mx-auto">
                    {file && (
                        <div className="mb-2 bg-white/10 rounded-lg p-2 flex items-center justify-between">
                            <span className="text-white text-sm">📎 {file.name}</span>
                            <button
                                onClick={() => {
                                    setFile(null)
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = ''
                                    }
                                }}
                                className="text-white/70 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <div className="flex items-end space-x-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*,.pdf"
                            className="hidden"
                        />

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-shrink-0 bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg transition-colors"
                            title="Upload KYC Document"
                        >
                            <Upload className="w-5 h-5" />
                        </button>

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            rows="1"
                            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                        />

                        <button
                            onClick={handleSend}
                            disabled={loading || (!input.trim() && !file)}
                            className="flex-shrink-0 bg-white text-primary-700 p-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
