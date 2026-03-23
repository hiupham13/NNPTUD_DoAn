import './index.css'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-alabaster)' }}>
      <div className="text-center">
        <h1
          className="text-6xl md:text-8xl mb-6 tracking-tight"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-charcoal)' }}
        >
          Luxury Watch
        </h1>
        <p
          className="text-lg uppercase tracking-[0.3em] mb-8"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-warm-gray)' }}
        >
          Timeless Elegance
        </p>
        <div
          className="w-16 h-[1px] mx-auto"
          style={{ backgroundColor: 'var(--color-gold)' }}
        />
      </div>
    </div>
  )
}

export default App
