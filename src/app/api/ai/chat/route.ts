import { NextResponse } from 'next/server'
import { getGeminiResponse } from '../../../../lib/gemini'

export async function POST(request: Request) {
  try {
    const { messages, context } = await request.json()
    
    const lastMessage = messages[messages.length - 1].content
    const prompt = `Context from the document: "${context}"\n\nUser question: "${lastMessage}"\n\nPlease provide a helpful response about this text.`
    
    const response = await getGeminiResponse(prompt)
    
    return NextResponse.json({ response })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}