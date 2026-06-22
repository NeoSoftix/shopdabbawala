import { useState, useEffect, useRef, useCallback } from 'react'

const DEFAULTS = {
  duration: 10,
  easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
  content: 'slideLeft',
  background: 'slideDown',
  ingredients: 'slideDown',
}

/**
 * Returns CSS transform/opacity values for an animated element.
 *
 * phase:     'idle' | 'init' | 'running'
 * isOutgoing: true = slide that is leaving
 * dir:        'next' | 'prev' — reverses X-axis animations on prev
 */
function getAnimValues(type, phase, isOutgoing, dir) {
  if (type === 'fade') {
    const visible = isOutgoing ? phase !== 'running' : phase !== 'init'
    return { transform: 'none', opacity: visible ? 1 : 0 }
  }

  let axis, exitVal, enterVal

  if (type === 'slideDown') {
    axis = 'Y'; exitVal = '100%'; enterVal = '-100%'
  } else if (type === 'slideUp') {
    axis = 'Y'; exitVal = '-100%'; enterVal = '100%'
  } else if (type === 'slideRight') {
    axis = 'X'
    exitVal  = dir === 'next' ? '100%'  : '-100%'
    enterVal = dir === 'next' ? '-100%' : '100%'
  } else {
    // slideLeft (default for content)
    axis = 'X'
    exitVal  = dir === 'next' ? '-100%' : '100%'
    enterVal = dir === 'next' ? '100%'  : '-100%'
  }

  const val = isOutgoing
    ? (phase === 'running' ? exitVal : '0%')
    : (phase === 'init'    ? enterVal : '0%')

  return { transform: `translate${axis}(${val})`, opacity: 1 }
}

export default function HeroCarousel({
  slides = [],
  transition = {},
  autoPlay = false,
  autoPlayInterval = 4000,
  height = '100vh',
  titleFont = "Impact, 'Arial Black', sans-serif",
  onSlideChange,
}) {
  const tr = { ...DEFAULTS, ...transition }

  const [current, setCurrent] = useState(0)
  const [outgoing, setOutgoing] = useState(null)
  const [phase, setPhase] = useState('idle')
  const [dir, setDir] = useState('next')

  const lockRef = useRef(false)
  const timerRef = useRef(null)
  const currentRef = useRef(current)
  currentRef.current = current

  const navigate = useCallback((nextIdx, direction) => {
    if (lockRef.current || nextIdx === currentRef.current) return
    lockRef.current = true

    const cur = currentRef.current
    const resolvedDir = direction ?? (nextIdx > cur ? 'next' : 'prev')

    setOutgoing(cur)
    setCurrent(nextIdx)
    setDir(resolvedDir)
    setPhase('init')

    // Double rAF: let React paint the 'init' positions before starting the animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase('running'))
    })

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setOutgoing(null)
      setPhase('idle')
      lockRef.current = false
      onSlideChange?.(nextIdx)
    }, tr.duration + 80)
  }, [tr.duration, onSlideChange])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return
    const id = setInterval(
      () => navigate((currentRef.current + 1) % slides.length, 'next'),
      autoPlayInterval
    )
    return () => clearInterval(id)
  }, [autoPlay, autoPlayInterval, navigate, slides.length])

  const goNext = () => navigate((currentRef.current + 1) % slides.length, 'next')
  const goPrev = () => navigate((currentRef.current - 1 + slides.length) % slides.length, 'prev')

  if (!slides.length) return null

  const transProp = `transform ${tr.duration}ms ${tr.easing}, opacity ${tr.duration}ms ${tr.easing}`

  function layerStyle(type, isOutgoing, zIndex) {
    const { transform, opacity } = getAnimValues(type, phase, isOutgoing, dir)
    return {
      position: 'absolute',
      inset: 0,
      zIndex,
      transform,
      opacity,
      transition: phase === 'running' ? transProp : 'none',
      willChange: 'transform, opacity',
    }
  }

  // ─── Layer A: Background ─────────────────────────────────────────
  // Outgoing bg (z-2) slides away, revealing incoming bg (z-1) underneath
  function renderBg(slideIdx, isOutgoing) {
    const slide = slides[slideIdx]
    if (!slide) return null
    return (
      <div
        key={`bg-${isOutgoing ? 'out' : 'in'}`}
        style={layerStyle(tr.background, isOutgoing, isOutgoing ? 2 : 1)}
        aria-hidden="true"
      >
        <div style={{ position: 'absolute', inset: 0, backgroundColor: slide.bgColor }} />
      </div>
    )
  }

  // ─── Layer B: Title + Bowl + CTA ─────────────────────────────────
  // Slides horizontally. Inside: title (z-1 = behind bowl), bowl (z-2), CTA (z-3)
  function renderContent(slideIdx, isOutgoing) {
    const slide = slides[slideIdx]
    if (!slide) return null
    return (
      <div
        key={`content-${isOutgoing ? 'out' : 'in'}`}
        style={layerStyle(tr.content, isOutgoing, isOutgoing ? 11 : 12)}
        aria-hidden={isOutgoing}
      >
        {/* Giant title text — sits behind the bowl via lower z-index */}
        <div
          style={{
            position: 'absolute',
            top: '50%', left: 0, right: 0,
            transform: 'translateY(-50%)',
            textAlign: 'center',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              display: 'block',
              fontFamily: titleFont,
              fontSize: 'clamp(56px, 13vw, 148px)',
              fontWeight: 900,
              color: 'rgba(255,255,255,0.92)',
              letterSpacing: '0.02em',
              lineHeight: 1,
              textTransform: 'uppercase',
            }}
          >
            {slide.title}
          </span>
        </div>

        {/* Circular bowl / hero image */}
        <div
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(44vh, 400px)',
            height: 'min(44vh, 400px)',
            borderRadius: '50%',
            overflow: 'hidden',
            zIndex: 2,
            boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
            flexShrink: 0,
          }}
        >
          {slide.heroImage ? (
            <img
              src={slide.heroImage}
              alt={slide.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div
              style={{
                width: '100%', height: '100%',
                background: 'rgba(255,255,255,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '80px',
              }}
            >
              {slide.heroEmoji ?? '🍽'}
            </div>
          )}
        </div>

        {/* Bottom-left: description + price + CTA button */}
        {(slide.description || slide.price || slide.ctaLabel) && (
          <div
            style={{
              position: 'absolute',
              bottom: '12%', left: '5%',
              zIndex: 3,
              pointerEvents: isOutgoing ? 'none' : 'all',
            }}
          >
            {slide.description && (
              <p
                style={{
                  color: 'rgba(255,255,255,0.82)',
                  fontSize: '13px', lineHeight: 1.6,
                  maxWidth: '200px', margin: '0 0 10px',
                }}
              >
                {slide.description}
              </p>
            )}
            {slide.price && (
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '20px', margin: '0 0 12px' }}>
                {slide.price}
              </p>
            )}
            {slide.ctaLabel && (
              <button
                onClick={slide.onCta}
                style={{
                  background: '#fff',
                  color: slide.bgColor ?? '#333',
                  fontWeight: 700, fontSize: '12px',
                  padding: '10px 22px',
                  borderRadius: '100px',
                  border: 'none', cursor: 'pointer',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {slide.ctaLabel}
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  // ─── Layer C: Ingredient images ───────────────────────────────────
  // Floats in front of the bowl (z-31/32), animates vertically
  function renderIngredients(slideIdx, isOutgoing) {
    const slide = slides[slideIdx]
    if (!slide?.ingredients?.length) return null
    return (
      <div
        key={`ing-${isOutgoing ? 'out' : 'in'}`}
        style={layerStyle(tr.ingredients, isOutgoing, isOutgoing ? 32 : 31)}
        aria-hidden="true"
      >
        {slide.ingredients.map((item, i) =>
          item.src ? (
            <img
              key={i}
              src={item.src}
              alt={item.alt ?? ''}
              style={{ position: 'absolute', objectFit: 'contain', ...item.style }}
            />
          ) : (
            <span
              key={i}
              style={{ position: 'absolute', lineHeight: 1, userSelect: 'none', ...item.style }}
            >
              {item.emoji}
            </span>
          )
        )}
      </div>
    )
  }

  const arrowBtn = {
    width: '44px', height: '44px', borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.55)',
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: '#fff', fontSize: '22px',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 200ms, border-color 200ms',
    padding: 0,
  }

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        height,
        width: '100%',
        userSelect: 'none',
      }}
    >
      {/* A: Background */}
      {outgoing !== null && renderBg(outgoing, true)}
      {renderBg(current, false)}

      {/* B: Title + Bowl + CTA */}
      {outgoing !== null && renderContent(outgoing, true)}
      {renderContent(current, false)}

      {/* C: Ingredients (in front of bowl) */}
      {outgoing !== null && renderIngredients(outgoing, true)}
      {renderIngredients(current, false)}

      {/* Static UI layer */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 50, pointerEvents: 'none' }}>
        {/* Prev / Next arrows */}
        <div
          style={{
            position: 'absolute', bottom: '8%', right: '4%',
            display: 'flex', gap: '10px',
            pointerEvents: 'all',
          }}
        >
          <button onClick={goPrev} style={arrowBtn} aria-label="Previous slide">&#8249;</button>
          <button onClick={goNext} style={arrowBtn} aria-label="Next slide">&#8250;</button>
        </div>

        {/* Dot indicators */}
        {slides.length > 1 && (
          <div
            style={{
              position: 'absolute', bottom: '3%', left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex', gap: '6px',
              pointerEvents: 'all',
            }}
          >
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => navigate(i, i > current ? 'next' : 'prev')}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === current ? '20px' : '8px',
                  height: '8px', borderRadius: '4px',
                  background: i === current ? '#fff' : 'rgba(255,255,255,0.45)',
                  border: 'none', cursor: 'pointer',
                  transition: 'width 300ms, background 300ms',
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
