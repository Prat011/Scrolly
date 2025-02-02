import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { MessageSquare, Send } from 'lucide-react'
import { RainbowButton } from '../ui/rainbow-button'
import ReactMarkdown from 'react-markdown'

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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <Card key={idx}>
              <CardContent className="pt-4 prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="border-t bg-slate-50 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the text..."
            className="flex-1 p-2 border rounded-md"
            disabled={isLoading}
          />
          <RainbowButton onClick={handleSubmit} disabled={isLoading}>
            <Send className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </RainbowButton>
        </div>
      </div>
    </div>
  )
}
