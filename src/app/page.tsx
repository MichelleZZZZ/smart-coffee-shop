import Link from "next/link";
import { gql } from "@apollo/client";
import client from "@/lib/apollo-client";
import Image from "next/image";
import { Document } from "@contentful/rich-text-types";

const GET_HOME = gql`
  query {
    smartCoffeeShopHomePageCollection(limit: 1) {
      items {
        heroImage {
          url
        }
        title
        subtitle
        callToActionsCollection {
          items {
            title
            icon {
              url
              title
            }
            content {
              json
            }
            
          }
        }
      }
    }
  }
`

type HomePageData = {
  heroImage?: {
    url: string
  }
  title: string
  subtitle: string
  callToActionsCollection: {
    items: CallToAction[]
  }
}

type CallToAction = {
  title?: string
  icon?: {
    url: string
    title?: string
  }
  content?: {
    json: Document
  }
  link?: {
    url?: string
  }
}

type QueryResponse = {
  smartCoffeeShopHomePageCollection: {
    items: HomePageData[]
  }
}

// Helper function to check if URL is a video file
function isVideoFile(url: string): boolean {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv']
  const lowerUrl = url.toLowerCase()
  return videoExtensions.some(ext => lowerUrl.includes(ext))
}

// Helper function to render RichText content
function renderRichTextContent(content: Document): string {
  if (!content || !content.content) return ''
  
  try {
    return content.content
      .map((node) => {
        if (node.nodeType === 'paragraph' && 'content' in node) {
          const paragraphNode = node as { content?: Array<{ value?: string }> }
          return paragraphNode.content?.map((textNode) => textNode.value || '').join('') || ''
        }
        return ''
      })
      .join(' ')
      .trim()
  } catch (error) {
    console.error('Error rendering RichText content:', error)
    return 'Content unavailable'
  }
}

export default async function HomePage() {
  const result = await client.query<QueryResponse>({ query: GET_HOME })
  const homeData = result.data?.smartCoffeeShopHomePageCollection?.items[0]

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Media */}
        <div className="absolute inset-0 z-0">
          {homeData?.heroImage ? (
            isVideoFile(homeData.heroImage.url) ? (
              <video
                autoPlay
                muted
                loop={false}
                playsInline
                className="w-full h-full object-cover animate-fade-in"
              >
                <source src={homeData.heroImage.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={homeData.heroImage.url}
                alt="Coffee hero image"
                fill
                className="object-cover"
                priority
              />
            )
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700"></div>
          )}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-8 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            {homeData?.title || "Smart Coffee Shop"}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-amber-100 max-w-2xl mx-auto">
            {homeData?.subtitle || "Discover the perfect blend of premium coffee products and expert brewing techniques"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Browse Products
            </Link>
            <Link 
              href="/blog" 
              className="border-2 border-white text-white hover:bg-white hover:text-amber-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              Read Our Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Actions Section */}
      {homeData?.callToActionsCollection?.items && homeData.callToActionsCollection.items.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Why Choose Smart Coffee Shop?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {homeData.callToActionsCollection.items.map((cta, index) => (
                <div key={index} className="text-center p-6">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {cta.icon?.url ? (
                      <Image
                        src={cta.icon.url}
                        alt={cta.title || 'Icon'}
                        width={32}
                        height={32}
                        className="w-8 h-8"
                      />
                    ) : (
                      <span className="text-2xl">☕</span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{cta.title || 'Call to Action'}</h3>
                  <p className="text-gray-600 mb-4">
                    {cta.content?.json ? renderRichTextContent(cta.content.json) : 'No content available'}
                  </p>
                  {cta.link?.url && (
                    <Link 
                      href={cta.link.url}
                      className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                    >
                      Learn More
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}