import { useState, useEffect } from 'react'
import { Card, CardContent } from '../ui/card'

interface ExplanationsProps {
  selectedText: string
}

export function Explanations({ selectedText }: ExplanationsProps) {
  const [explanation, setExplanation] = useState<string>('')

  useEffect(() => {
    if (selectedText) {
      getExplanation(selectedText)
    }
  }, [selectedText])

  const getExplanation = async (text: string) => {
    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      
      const data = await response.json()
      setExplanation(data.explanation)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="mt-4">
      {explanation && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm">{explanation}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}