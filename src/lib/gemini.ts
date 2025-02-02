import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!)

export async function getGeminiResponse(prompt: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro'})
  model.apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!
  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw error
  }
}