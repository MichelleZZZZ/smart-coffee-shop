import Image from "next/image";

export default function Home() {
  return (
    <main style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '2rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          color: '#1f2937'
        }}>
          ☕ Smart Coffee Hub
        </h1>
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>
          Your daily dose of coffee and tech
        </p>
        <button style={{
          backgroundColor: '#1f2937',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          border: 'none',
          fontSize: '1rem',
          cursor: 'pointer',
          fontWeight: '500'
        }}>
          Order Coffee
        </button>
      </div>
    </main>
  )
}