import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: Request) {
  try {
    
    const { message } = await req.json()
    
    
    if (!message) {
      return Response.json({ reply: 'Please provide a message.' }, { status: 400 })
    }
    
    // Check if API key is available
    const apiKey = process.env.GEMINI_API_KEY
    console.log('API Key exists:', !!apiKey)
    
    if (!apiKey) {
      console.log('No Google AI API key found')
      return Response.json({ 
        reply: 'AI service is not configured. Please add GEMINI_API_KEY to your environment variables.' 
      }, { status: 500 })
    }
    
    console.log('Using Google Generative AI SDK with Gemini 1.5 Flash...')
    
    // Use Google Generative AI SDK with Gemini Pro
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    })
    
    const prompt = `You are a friendly coffee shop assistant for "Smart Coffee Hub". Answer this question briefly and helpfully: ${message}`
    
    console.log('Generating content...')
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('AI replied:', text)
    return Response.json({ reply: text })
    
  } catch (error) {
    console.error('API Error details:', error)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    
    return Response.json({ 
      reply: `Sorry, something went wrong! Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}