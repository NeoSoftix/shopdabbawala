import { useState, useEffect, useRef, useCallback } from "react";

const DEFAULTS = {
  duration: 800,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  content: "fade",
  background: "fade",
  ingredients: "fade",
};

/**
 * Clean & Safe getAnimValues function with responsive boundaries
 */
function getAnimValues(type, phase, isOutgoing, dir, isMobile) {
  // Enhanced dynamic view coordinates based on layout type
  const viewWidth = isMobile ? "100vw" : "150vw";
  const viewHeight = "100vh";

  if (type === "fade") {
    const visible = isOutgoing ? phase !== "running" : phase !== "init";
    return { transform: "none", opacity: visible ? 1 : 0 };
  }

  if (type === "plateRoll") {
    if (isOutgoing) {
      return {
        transform: phase === "running"
          ? `translate3d(-${viewWidth}, 0, 0) rotate(-12deg) scale(0.85)`
          : "translate3d(0, 0, 0) rotate(0deg) scale(1)",
        opacity: phase === "running" ? 0 : 1,
      };
    }

    return {
      transform: phase === "init"
        ? `translate3d(${viewWidth}, 0, 0) rotate(12deg) scale(0.85)`
        : "translate3d(0, 0, 0) rotate(0deg) scale(1)",
      opacity: phase === "init" ? 0 : 1,
    };
  }

  if (type === "titleSlide") {
    if (isOutgoing) {
      return {
        transform: phase === "running" ? `translate3d(-${viewWidth}, 0, 0)` : "translate3d(0, 0, 0)",
        opacity: phase === "running" ? 0 : 1,
      };
    }

    return {
      transform: phase === "init" ? `translate3d(${viewWidth}, 0, 0)` : "translate3d(0, 0, 0)",
      opacity: phase === "init" ? 0 : 1,
    };
  }

  if (type === "ingredientsSlide") {
    if (isOutgoing) {
      return {
        transform: phase === "running" ? `translate3d(0, ${viewHeight}, 0)` : "translate3d(0, 0, 0)",
        opacity: phase === "running" ? 0 : 1,
      };
    }

    return {
      transform: phase === "init" ? `translate3d(0, -${viewHeight}, 0)` : "translate3d(0, 0, 0)",
      opacity: phase === "init" ? 0 : 1,
    };
  }

  return { transform: "none", opacity: 1 };
}

export default function HeroCarousel({
  slides = [],
  transition = {},
  autoPlay = false,
  autoPlayInterval = 4200,
  height = "100vh",
  titleFont = "Impact, 'Arial Black', sans-serif",
  onSlideChange,
}) {
  const tr = {
    ...DEFAULTS,
    ...transition,
    duration: 1200, // Slightly tuned down to match responsive scaling speed profiles
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    background: "fade",
    content: "fade",
  };

  const [current, setCurrent] = useState(0);
  const [outgoing, setOutgoing] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [dir, setDir] = useState("next");
  
  // Responsive viewport dimensions listener hooks
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const lockRef = useRef(false);
  const timerRef = useRef(null);
  const currentRef = useRef(current);
  currentRef.current = current;

  const navigate = useCallback(
    (nextIdx, direction) => {
      if (lockRef.current || nextIdx === currentRef.current) return;
      lockRef.current = true;

      const cur = currentRef.current;
      const resolvedDir = direction ?? (nextIdx > cur ? "next" : "prev");

      setOutgoing(cur);
      setCurrent(nextIdx);
      setDir(resolvedDir);
      setPhase("init");

      setTimeout(() => {
        setPhase("running");
      }, 50);

      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setOutgoing(null);
        setPhase("idle");
        lockRef.current = false;
        onSlideChange?.(nextIdx);
      }, tr.duration + 50);
    },
    [tr.duration, onSlideChange],
  );

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const id = setInterval(
      () => navigate((currentRef.current + 1) % slides.length, "next"),
      autoPlayInterval,
    );
    return () => clearInterval(id);
  }, [autoPlay, autoPlayInterval, navigate, slides.length]);

  const goNext = () => navigate((currentRef.current + 1) % slides.length, "next");
  const goPrev = () => navigate((currentRef.current - 1 + slides.length) % slides.length, "prev");

  if (!slides.length) return null;

  const transProp = `transform ${tr.duration}ms ${tr.easing}, opacity ${tr.duration}ms ${tr.easing}`;

  function layerStyle(type, isOutgoing, zIndex) {
    const { transform, opacity } = getAnimValues(type, phase, isOutgoing, dir, isMobile);
    return {
      position: "absolute",
      inset: 0,
      zIndex,
      transform,
      opacity,
      transition: transProp,
      willChange: "transform, opacity",
      pointerEvents: "none",
    };
  }

  // Layer A: Background Color
  function renderBg(slideIdx, isOutgoing) {
    const slide = slides[slideIdx];
    if (!slide) return null;
    return (
      <div
        key={`bg-${slideIdx}-${isOutgoing ? "out" : "in"}`}
        style={{
          ...layerStyle("fade", isOutgoing, isOutgoing ? 2 : 1),
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, ${slide.bgColor} 75%)`,
        }}
        aria-hidden="true"
      />
    );
  }

  // Layer B1: Responsive Big Title Text
  function renderTitleText(slideIdx, isOutgoing) {
    const slide = slides[slideIdx];
    if (!slide) return null;
    return (
      <div
        key={`title-${slideIdx}-${isOutgoing ? "out" : "in"}`}
        style={layerStyle("titleSlide", isOutgoing, isOutgoing ? 10 : 11)}
        aria-hidden={isOutgoing}
      >
        <div
          style={{
            position: "absolute",
            top: isMobile ? "24%" : "50%",
            left: 0,
            right: 0,
            transform: "translateY(-50%)",
            textAlign: "center",
            zIndex: 1,
            padding: "0 10px",
          }}
        >
          <span
            style={{
              display: "block",
              fontFamily: titleFont,
              fontSize: isMobile ? "clamp(46px, 12vw, 80px)" : "clamp(80px, 15vw, 220px)",
              fontWeight: 900,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "0.02em",
              lineHeight: 0.95,
              textTransform: "uppercase",
              wordBreak: "break-word",
            }}
          >
            {slide.title}
          </span>
        </div>
      </div>
    );
  }

  // Layer B2: Circular Plate Layer
  function renderPlate(slideIdx, isOutgoing) {
    const slide = slides[slideIdx];
    if (!slide) return null;

    // Fluid dimensions relative to design breakpoints
    const plateSize = isMobile ? "min(34vh, 260px)" : "min(52vh, 500px)";

    return (
      <div
        key={`plate-${slideIdx}-${isOutgoing ? "out" : "in"}`}
        style={layerStyle("plateRoll", isOutgoing, isOutgoing ? 20 : 21)}
        aria-hidden={isOutgoing}
      >
        <div
          style={{
            position: "absolute",
            top: isMobile ? "50%" : "50%",
            left: "50%",
            transform: "translate3d(-50%, -50%, 0)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: plateSize,
              height: plateSize,
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.1)`,
            }}
          >
            {slide.heroImage ? (
              <img
                src={slide.heroImage}
                alt={slide.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: isMobile ? "scale(1.25)" : "scale(1.4)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "rgba(255,255,255,0.22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isMobile ? "44px" : "80px",
                }}
              >
                {slide.heroEmoji ?? "🍽"}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Layer B3: Content Descriptions & Actions Box
  function renderCtaAndDesc(slideIdx, isOutgoing) {
    const slide = slides[slideIdx];
    if (!slide || (!slide.description && !slide.price && !slide.ctaLabel))
      return null;
    return (
      <div
        key={`cta-${slideIdx}-${isOutgoing ? "out" : "in"}`}
        style={layerStyle("fade", isOutgoing, isOutgoing ? 25 : 26)}
      >
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? "14%" : "12%",
            left: isMobile ? "0" : "5%",
            right: isMobile ? "0" : "auto",
            margin: isMobile ? "0 auto" : "0",
            textAlign: isMobile ? "center" : "left",
            maxWidth: isMobile ? "280px" : "320px",
            pointerEvents: isOutgoing ? "none" : "all",
            padding: "0 16px",
          }}
        >
          {slide.description && (
            <p
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: isMobile ? "13px" : "14px",
                lineHeight: 1.5,
                margin: "0 0 10px",
              }}
            >
              {slide.description}
            </p>
          )}
          {slide.price && (
            <p
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: isMobile ? "22px" : "26px",
                margin: "0 0 12px",
              }}
            >
              {slide.price}
            </p>
          )}
          {slide.ctaLabel && (
            <button
              onClick={slide.onCta}
              style={{
                background: "#fff",
                color: slide.bgColor ?? "#333",
                fontWeight: 700,
                fontSize: isMobile ? "11px" : "12px",
                padding: isMobile ? "10px 24px" : "12px 28px",
                borderRadius: "100px",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              }}
            >
              {slide.ctaLabel}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Layer 5: Floating Ingredient Elements (Hidden dynamically on small mobile devices to avoid chaos)
  function renderIngredients(slideIdx, isOutgoing) {
    if (isMobile) return null; 
    const slide = slides[slideIdx];
    if (!slide?.ingredients?.length) return null;

    return (
      <div
        key={`ing-wrapper-${slideIdx}-${isOutgoing ? "out" : "in"}`}
        style={layerStyle("ingredientsSlide", isOutgoing, isOutgoing ? 32 : 31)}
        aria-hidden="true"
      >
        {slide.ingredients.map((item, i) =>
          item.src ? (
            <img
              key={`ing-img-${slideIdx}-${i}-${isOutgoing ? "out" : "in"}`}
              src={item.src}
              alt={item.alt ?? ""}
              style={{
                position: "absolute",
                objectFit: "contain",
                ...item.style,
              }}
            />
          ) : (
            <span
              key={`ing-emoji-${slideIdx}-${i}-${isOutgoing ? "out" : "in"}`}
              style={{
                position: "absolute",
                lineHeight: 1,
                userSelect: "none",
                ...item.style,
              }}
            >
              {item.emoji}
            </span>
          ),
        )}
      </div>
    );
  }

  const arrowBtn = {
    width: isMobile ? "38px" : "44px",
    height: isMobile ? "38px" : "44px",
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.45)",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    color: "#fff",
    fontSize: isMobile ? "18px" : "22px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  };

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        height,
        width: "100%",
        userSelect: "none",
      }}
    >
      {renderBg(current, false)}
      {outgoing !== null && renderBg(outgoing, true)}

      {renderTitleText(current, false)}
      {outgoing !== null && renderTitleText(outgoing, true)}

      {renderPlate(current, false)}
      {outgoing !== null && renderPlate(outgoing, true)}

      {renderCtaAndDesc(current, false)}
      {outgoing !== null && renderCtaAndDesc(outgoing, true)}

      {renderIngredients(current, false)}
      {outgoing !== null && renderIngredients(outgoing, true)}

      {/* Control Interface UI Elements */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        {/* Navigation Arrows */}
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? "4%" : "8%",
            right: isMobile ? "5%" : "4%",
            display: "flex",
            gap: "8px",
            pointerEvents: "all",
          }}
        >
          <button onClick={goPrev} style={arrowBtn} aria-label="Previous slide">
            &#8249;
          </button>
          <button onClick={goNext} style={arrowBtn} aria-label="Next slide">
            &#8250;
          </button>
        </div>

        {/* Carousel Indicators Pagination dots */}
        {slides.length > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "4%",
              left: isMobile ? "5%" : "50%",
              transform: isMobile ? "none" : "translateX(-50%)",
              display: "flex",
              gap: "6px",
              pointerEvents: "all",
              alignItems: "center",
            }}
          >
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => navigate(i, i > current ? "next" : "prev")}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === current ? (isMobile ? "16px" : "20px") : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: i === current ? "#fff" : "rgba(255,255,255,0.4)",
                  border: "none",
                  cursor: "pointer",
                  transition: "width 300ms, background 300ms",
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}