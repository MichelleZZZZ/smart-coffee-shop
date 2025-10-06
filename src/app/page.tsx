import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to Smart Coffee Hub</h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover our curated collection of premium coffee products
        </p>
        <Link 
          href="/products" 
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </Link>

        <Link 
          href="/blog" 
          className="inne-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Browse Blog
        </Link>

      </div>
    </main>
  );
}