import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { MessageSquare, Send } from 'lucide-react'
import { RainbowButton } from '../ui/rainbow-button'
import ReactMarkdown from 'react-markdown'
import { cn } from '../../lib/utils'
import { Star } from 'lucide-react'

interface DiscussionProps {
  selectedText: string
}

export function Discussion({ selectedText }: DiscussionProps) {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return

    const newMessage = { role: 'user', content: input }
    setMessages([...messages, newMessage])
    setInput('') // Clear input immediately
    setIsLoading(true)
    
    // Add loading message
    setMessages(prev => [...prev, { role: 'assistant', content: '...' }])

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newMessage],
          context: selectedText
        })
      })
      
      const data = await response.json()
      // Replace loading message with actual response
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Error:', error)
      // Remove loading message on error
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full font-['Instrument_Serif']">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <Card key={idx} className={cn(
              "border",
              msg.role === 'user' 
                ? "bg-blue-950/80 border-blue-800/50" 
                : "bg-zinc-900/90 border-purple-800/40"
            )}>
              <CardContent className={cn(
                "pt-4 prose prose-sm dark:prose-invert max-w-none",
                msg.role === 'user'
                  ? "text-blue-100 text-sm"
                  : "text-purple-100 text-base font-['Instrument_Serif']"
              )}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-800  p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Ask about the text..."
            className="flex-1 p-2 border rounded-md bg-black/60 border-gray-700 text-white font-['Instrument_Serif'] placeholder:text-white-500"
            disabled={isLoading}
          />
          <RainbowButton 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="p-2 rounded-md bg-black/60 border border-black-900 hover:bg-white/40 disabled:opacity-50"
          >
            <Send className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </RainbowButton>
        </div>
      </div>
    </div>
  )
}
