import { NextResponse } from 'next/server'
import { getGeminiResponse } from '../../../../lib/gemini'

export async function POST(request: Request) {
  try {
    const { text } = await request.json()
    
    const prompt = `Please explain this text in simple terms: "${text}". Provide context, definitions, and related concepts if relevant.`
    
    const explanation = await getGeminiResponse(prompt)
    
    return NextResponse.json({ explanation })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}