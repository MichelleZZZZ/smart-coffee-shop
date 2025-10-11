import { GoogleGenerativeAI } from '@google/generative-ai'
import { getCoffeeShopContext } from '@/lib/coffee-shop-content'
import { findContentMatch, extractContentInfo } from '@/lib/content-matcher'
import type { Product, BlogPost } from '@/lib/types'

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
    
    // First, check if the user's question matches specific products or blog posts
    const contentMatch = await findContentMatch(message)
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
    
    let prompt = `You are a friendly and knowledgeable coffee shop assistant for "Smart Coffee Shop". 

Use the following information about our coffee shop to answer customer questions accurately and helpfully:

${coffeeShopContext}`

    // Add specific content if we found a match
    if (contentMatch.type === 'product' && contentMatch.item) {
      const product = contentMatch.item as Product
      const productInfo = extractContentInfo(product.description)
      prompt += `

SPECIFIC PRODUCT INFORMATION:
- **Product Name**: ${product.name}
- **Category**: ${product.category}
- **Description**: ${productInfo}
- **Slug**: ${product.slug}

The customer's question seems to be about this specific product. Please provide detailed information about this product and suggest they can learn more by visiting the product page.`
    } else if (contentMatch.type === 'blog' && contentMatch.item) {
      const blogPost = contentMatch.item as BlogPost
      const blogContent = extractContentInfo(blogPost.body)
      prompt += `

SPECIFIC BLOG POST INFORMATION:
- **Title**: ${blogPost.title}
- **Excerpt**: ${blogPost.excerpt || 'No excerpt available'}
- **Category**: ${blogPost.category || 'General'}
- **Content**: ${blogContent.substring(0, 500)}...
- **Slug**: ${blogPost.slug}

The customer's question seems to be related to this blog post. Please provide relevant information from this post and suggest they can read the full article.`
    }

    prompt += `

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
  - Use code formatting for specific terms like WiFi passwords
- If you found a specific product or blog post match, mention it and provide a relative link using the format: [link text](/products/slug) for products or [link text](/blog/slug) for blog posts

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