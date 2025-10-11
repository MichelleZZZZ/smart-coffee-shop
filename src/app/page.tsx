import Link from "next/link";
import contentfulClient from "@/lib/contentful-client";
import Image from "next/image";

// Contentful REST API types
type ContentfulAsset = {
  sys: {
    id: string
  }
  fields: {
    title?: string
    file: {
      url: string
      contentType: string
    }
  }
}

type ContentfulEntry = {
  sys: {
    id: string
    contentType: {
      sys: {
        id: string
      }
    }
  }
  fields: Record<string, unknown>
}

type HomePageData = {
  heroImage?: ContentfulAsset
  title: string
  subtitle: string
  callToActions?: ContentfulEntry[]
}

type CallToAction = {
  title?: string
  icon?: ContentfulAsset
  content?: {
    content: unknown[]
    data: Record<string, unknown>
    nodeType: string
  }
  link?: ContentfulEntry
}

// Helper function to check if URL is a video file
function isVideoFile(url: string): boolean {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv']
  const lowerUrl = url.toLowerCase()
  return videoExtensions.some(ext => lowerUrl.includes(ext))
}

// Helper function to fix protocol-relative URLs
function fixProtocolRelativeUrl(url: string): string {
  if (url.startsWith('//')) {
    return `https:${url}`
  }
  return url
}

// Helper function to render RichText content
function renderRichTextContent(content: Record<string, unknown>): string {
  if (!content || !content.content) return ''
  
  try {
    return (content.content as Array<Record<string, unknown>>)
      .map((node: Record<string, unknown>) => {
        if (node.nodeType === 'paragraph' && node.content) {
          return (node.content as Array<Record<string, unknown>>)
            .map((textNode: Record<string, unknown>) => textNode.value || '')
            .join('')
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
  // Get home page data using REST API
  const homePageEntries = await contentfulClient.getEntries({
    content_type: 'smartCoffeeShopHomePage',
    limit: 1
  })
  
  const homeData = homePageEntries.items[0]?.fields as HomePageData
  
  // Get call to actions if they exist
  let callToActions: CallToAction[] = []
  if (homeData.callToActions) {
    const ctaEntries = await contentfulClient.getEntries({
      'sys.id[in]': homeData.callToActions.map(cta => cta.sys.id)
    })
    callToActions = ctaEntries.items.map(item => item.fields) as CallToAction[]
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Media */}
        <div className="absolute inset-0 z-0">
          {homeData?.heroImage ? (
            (() => {
              const imageUrl = fixProtocolRelativeUrl(homeData.heroImage.fields.file.url)
              return isVideoFile(imageUrl) ? (
                <video
                  autoPlay
                  muted
                  loop={false}
                  playsInline
                  className="w-full h-full object-cover animate-fade-in"
                >
                  <source src={imageUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={imageUrl}
                  alt="Coffee hero image"
                  fill
                  className="object-cover"
                  priority
                />
              )
            })()
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
      {callToActions && callToActions.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Why Choose Smart Coffee Shop?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {callToActions.map((cta, index) => (
                <div key={index}>
                  {cta.link ? (
                    <Link 
                      href={`/${cta.link.fields.slug || '#'}`}
                      className="block text-center p-6 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    >
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors duration-300">
                        {cta.icon?.fields?.file?.url ? (
                          <Image
                            src={fixProtocolRelativeUrl(cta.icon.fields.file.url)}
                            alt={cta.title || 'Icon'}
                            width={32}
                            height={32}
                            className="w-8 h-8"
                          />
                        ) : (
                          <span className="text-2xl">☕</span>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-amber-700 transition-colors duration-300">
                        {cta.title || 'Call to Action'}
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                        {cta.content ? renderRichTextContent(cta.content) : 'No content available'}
                      </p>
                    </Link>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        {cta.icon?.fields?.file?.url ? (
                          <Image
                            src={fixProtocolRelativeUrl(cta.icon.fields.file.url)}
                            alt={cta.title || 'Icon'}
                            width={32}
                            height={32}
                            className="w-8 h-8"
                          />
                        ) : (
                          <span className="text-2xl">☕</span>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-3">
                        {cta.title || 'Call to Action'}
                      </h3>
                      <p className="text-gray-600">
                        {cta.content ? renderRichTextContent(cta.content) : 'No content available'}
                      </p>
                    </div>
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