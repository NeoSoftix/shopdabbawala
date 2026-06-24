import { useState, useEffect, useRef, useCallback } from "react";

const DEFAULTS = {
  duration: 800,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  content: "fade",
  background: "fade",
  ingredients: "fade",
};

/**
 * Clean & Safe getAnimValues function
 */
function getAnimValues(type, phase, isOutgoing, dir) {
  // 1. Enhanced Fade logic for smooth color blending, text, and cta
  if (type === "fade") {
    const visible = isOutgoing ? phase !== "running" : phase !== "init";
    return { transform: "none", opacity: visible ? 1 : 0 };
  }

  if (type === "plateRoll") {
    if (isOutgoing) {
      return {
        transform: phase === "running"
          ? "translate3d(-150vw, 0, 0) rotate(-12deg) scale(0.95)"
          : "translate3d(0, 0, 0) rotate(0deg) scale(1)",
        opacity: phase === "running" ? 0.3 : 1,
      };
    }

    return {
      transform: phase === "init"
        ? "translate3d(150vw, 0, 0) rotate(12deg) scale(0.95)"
        : "translate3d(0, 0, 0) rotate(0deg) scale(1)",
      opacity: phase === "init" ? 0.3 : 1,
    };
  }

  // 2b. Title Slide Logic: Smooth horizontal transition without rotation
  if (type === "titleSlide") {
    if (isOutgoing) {
      return {
        transform: phase === "running" ? "translate3d(-150vw, 0, 0)" : "translate3d(0, 0, 0)",
        opacity: 1,
      };
    }

    return {
      transform: phase === "init" ? "translate3d(150vw, 0, 0)" : "translate3d(0, 0, 0)",
      opacity: 1,
    };
  }

  // 2c. Ingredients Slide Logic: Smooth vertical slide from top to bottom
  if (type === "ingredientsSlide") {
    if (isOutgoing) {
      return {
        transform: phase === "running" ? "translate3d(0, 100vh, 0)" : "translate3d(0, 0, 0)",
        opacity: phase === "running" ? 0 : 1,
      };
    }

    return {
      transform: phase === "init" ? "translate3d(0, -100vh, 0)" : "translate3d(0, 0, 0)",
      opacity: phase === "init" ? 0 : 1,
    };
  }

  // 3. Axis Sliders
  let axis, exitVal, enterVal;

  if (type === "slideDown") {
    axis = "Y";
    exitVal = "100%";
    enterVal = "-100%";
  } else if (type === "slideUp") {
    axis = "Y";
    exitVal = "-100%";
    enterVal = "100%";
  } else if (type === "slideRight") {
    axis = "X";
    exitVal = dir === "next" ? "100%" : "-100%";
    enterVal = dir === "next" ? "-100%" : "100%";
  } else {
    // slideLeft (default)
    axis = "X";
    exitVal = dir === "next" ? "-100%" : "100%";
    enterVal = dir === "next" ? "100%" : "-100%";
  }

  const val = isOutgoing
    ? phase === "running"
      ? exitVal
      : "0%"
    : phase === "init"
      ? enterVal
      : "0%";

  return { transform: `translate${axis}(${val})`, opacity: 1 };
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
  // Overriding transition parameters to guarantee the requested smooth animation timing and easing
  const tr = {
    ...DEFAULTS,
    ...transition,
    duration: 1600,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    background: "fade",
    content: "fade",
  };

  const [current, setCurrent] = useState(0);
  const [outgoing, setOutgoing] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [dir, setDir] = useState("next");

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

      // Force a paint cycle for the init state to ensure browser layout sync
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

  const goNext = () =>
    navigate((currentRef.current + 1) % slides.length, "next");
  const goPrev = () =>
    navigate((currentRef.current - 1 + slides.length) % slides.length, "prev");

  if (!slides.length) return null;

  // Single synced dynamic cubic transition string
  const transProp = `transform ${tr.duration}ms ${tr.easing}, opacity ${tr.duration}ms ${tr.easing}`;

  function layerStyle(type, isOutgoing, zIndex) {
    const { transform, opacity } = getAnimValues(type, phase, isOutgoing, dir);
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

  // ─── Layer A: Background Color Layer ────────────────────────────────
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
          background: `radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, ${slide.bgColor} 65%)`,
        }}
        aria-hidden="true"
      />
    );
  }

  // ─── Layer B1: Title Text Layer ──────────────────────────────────────
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
            top: "50%",
            left: 0,
            right: 0,
            transform: "translateY(-50%)",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          <span
            style={{
              display: "block",
              fontFamily: titleFont,
              fontSize: "clamp(80px, 15vw, 220px)",
              fontWeight: 900,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "0.02em",
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            {slide.title}
          </span>
        </div>
      </div>
    );
  }

  // ─── Layer B2: Circular Plate Layer ──────────────────────────────────
  function renderPlate(slideIdx, isOutgoing) {
    const slide = slides[slideIdx];
    if (!slide) return null;
    return (
      <div
        key={`plate-${slideIdx}-${isOutgoing ? "out" : "in"}`}
        style={layerStyle("plateRoll", isOutgoing, isOutgoing ? 20 : 21)}
        aria-hidden={isOutgoing}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate3d(-50%, -50%, 0)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "min(52vh, 500px)",
              height: "min(52vh, 500px)",
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow: `0 30px 100px rgba(0,0,0,0.35),0 0 50px rgba(255,255,255,0.15)`,
              animation: isOutgoing
                ? "plateExitTilt 1.6s ease forwards"
                : "plateEnterTilt 1.6s ease forwards",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "500px",
                height: "500px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                filter: "blur(100px)",
                zIndex: -1,
              }}
            />
            {slide.heroImage ? (
              <img
                src={slide.heroImage}
                alt={slide.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "scale(1.4)",
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
                  fontSize: "80px",
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

  // ─── Layer B3: Content & Buttons Layer ──────────────────────────────
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
            bottom: "12%",
            left: "5%",
            pointerEvents: isOutgoing ? "none" : "all",
          }}
        >
          {slide.description && (
            <p
              style={{
                color: "rgba(255,255,255,0.82)",
                fontSize: "13px",
                lineHeight: 1.6,
                maxWidth: "200px",
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
                fontWeight: 700,
                fontSize: "20px",
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
                fontSize: "12px",
                padding: "10px 22px",
                borderRadius: "100px",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {slide.ctaLabel}
            </button>
          )}
        </div>
      </div>
    );
  }

  function renderIngredients(slideIdx, isOutgoing) {
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
                animation: isOutgoing
                  ? "none"
                  : `ingredientFloat ${8 + i}s ease-in-out infinite`,
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
                animation: isOutgoing
                  ? "none"
                  : `ingredientFloat ${8 + i}s ease-in-out infinite`,
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
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.55)",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    color: "#fff",
    fontSize: "22px",
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
      {/* 1. Background Layer */}
      {outgoing !== null && renderBg(outgoing, true)}
      {renderBg(current, false)}

      {/* 2. Text Title (Behind) */}
      {outgoing !== null && renderTitleText(outgoing, true)}
      {renderTitleText(current, false)}

      {/* 3. Plate Layer (Rolls over Text) */}
      {outgoing !== null && renderPlate(outgoing, true)}
      {renderPlate(current, false)}

      {/* 4. Left side Content & CTA Button */}
      {outgoing !== null && renderCtaAndDesc(outgoing, true)}
      {renderCtaAndDesc(current, false)}

      {/* 5. Floating Ingredients */}
      {outgoing !== null && renderIngredients(outgoing, true)}
      {renderIngredients(current, false)}

      {/* Static UI Layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "8%",
            right: "4%",
            display: "flex",
            gap: "10px",
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

        {slides.length > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "3%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "6px",
              pointerEvents: "all",
            }}
          >
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => navigate(i, i > current ? "next" : "prev")}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === current ? "20px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: i === current ? "#fff" : "rgba(255,255,255,0.45)",
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
