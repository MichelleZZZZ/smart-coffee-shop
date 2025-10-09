import { GoogleGenerativeAI } from '@google/generative-ai'

// Fallback responses for when AI is not available
const fallbackResponses: { [key: string]: string } = {
  'coffee': 'Coffee is a wonderful beverage made from roasted coffee beans! It comes in many varieties like Arabica and Robusta, and can be brewed in countless ways.',
  'espresso': 'Espresso is a concentrated coffee beverage made by forcing hot water through finely-ground coffee beans. It\'s the base for many coffee drinks like lattes and cappuccinos.',
  'latte': 'A latte is a coffee drink made with espresso and steamed milk, typically topped with a small amount of foam. It\'s creamy and smooth!',
  'cappuccino': 'A cappuccino is an espresso-based drink with equal parts espresso, steamed milk, and milk foam. It has a rich, bold flavor.',
  'brewing': 'There are many ways to brew coffee: drip, French press, pour-over, cold brew, and more. Each method brings out different flavors from the beans.',
  'beans': 'Coffee beans are the seeds of the coffee plant. They\'re roasted to different levels (light, medium, dark) which affects the flavor profile.',
  'grind': 'The grind size of coffee beans affects extraction. Fine grind for espresso, medium for drip coffee, and coarse for French press.',
  'temperature': 'The ideal water temperature for brewing coffee is between 195-205°F (90-96°C). Too hot can burn the coffee, too cold won\'t extract properly.'
}

function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  // Check for keywords and return appropriate response
  for (const [keyword, response] of Object.entries(fallbackResponses)) {
    if (lowerMessage.includes(keyword)) {
      return response
    }
  }
  
  // Default fallback response
  return `Thanks for asking about "${message}"! I'm a coffee assistant, but I'm currently having some technical difficulties. Feel free to ask me about coffee brewing, different types of coffee drinks, or coffee beans, and I'll do my best to help!`
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    console.log('User asked:', message)
    
    if (!message) {
      return Response.json({ reply: 'Please provide a message.' }, { status: 400 })
    }
    
    // Check if API key is available
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      console.log('No Google AI API key found, using fallback response')
      const fallbackReply = getFallbackResponse(message)
      return Response.json({ reply: fallbackReply })
    }
    
    // Try to use Google AI
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const prompt = `You are a friendly coffee shop assistant. Answer this question briefly and helpfully: ${message}`
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      console.log('AI replied:', text)
      return Response.json({ reply: text })
      
    } catch (aiError) {
      console.error('Google AI Error:', aiError)
      // Fall back to our predefined responses
      const fallbackReply = getFallbackResponse(message)
      return Response.json({ reply: fallbackReply })
    }
    
  } catch (error) {
    console.error('API Error:', error)
    return Response.json({ 
      reply: 'Sorry, something went wrong! Please try again.' 
    }, { status: 500 })
  }
}