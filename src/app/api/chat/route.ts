import { GoogleGenerativeAI } from '@google/generative-ai'
import { getCoffeeShopContext } from '@/lib/coffee-shop-content'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    
    if (!message) {
      return Response.json({ reply: 'Please provide a message.' }, { status: 400 })
    }
    
    // Check if API key is available
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      return Response.json({ 
        reply: 'AI service is not configured. Please add GEMINI_API_KEY to your environment variables.' 
      }, { status: 500 })
    }
    
    // Get the coffee shop content as context
    const coffeeShopContext = getCoffeeShopContext()
    
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
    
    const prompt = `You are a friendly and knowledgeable coffee shop assistant for "Smart Coffee Hub". 

Use the following information about our coffee shop to answer customer questions accurately and helpfully:

${coffeeShopContext}

Customer Question: ${message}

Instructions:
- Answer based on the information provided above
- Be friendly, helpful, and concise
- If the question is about something not covered in the information, politely say you don't have that information and suggest they call or visit us
- Always maintain a warm, welcoming tone
- Include relevant details like prices, hours, or specific offerings when appropriate
- Use emojis sparingly to make responses more engaging
- **Use markdown formatting** for better readability:
  - Use **bold** for important information like prices, hours, or key details
  - Use *italics* for emphasis
  - Use bullet points (-) for lists of items, prices, or features
  - Use numbered lists (1.) for step-by-step instructions
  - Use `code` formatting for specific terms like WiFi passwords

Please provide a helpful response to the customer's question:`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    return Response.json({ reply: text })
    
  } catch (error) {
    console.error('API Error:', error)
    return Response.json({ 
      reply: `Sorry, something went wrong! Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}