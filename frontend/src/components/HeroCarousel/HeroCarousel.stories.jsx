import HeroCarousel from './HeroCarousel'
// Demo slides matching the Instagram reel screenshots.
// heroImage: swap these URLs for your real food photos.
// ingredients: use { src, style } for real images, or { emoji, style } for quick demos.
export const DEMO_SLIDES = [
  {
    id: 'berry',
    bgColor: '#E8574A',
    title: 'Berry Bliss',
    description:
      "At Fresh Brewed, we harness the essence of nature's best leaves to deliver you a truly exceptional experience.",
    price: '$12.00',
    ctaLabel: 'Order Now',
    heroImage: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=500&fit=crop&q=80',
    ingredients: [
      { emoji: '🥥', style: { top: '6%',  right: '10%', fontSize: '64px' } },
      { emoji: '🍓', style: { top: '20%', right: '3%',  fontSize: '52px' } },
      { emoji: '🍓', style: { bottom: '22%', right: '9%', fontSize: '44px' } },
      { emoji: '🫐', style: { top: '8%',  left: '5%',  fontSize: '48px' } },
    ],
  },
  {
    id: 'mango',
    bgColor: '#F5A623',
    title: 'Mango',
    description:
      "At Fresh Brewed, we harness the essence of nature's best leaves to deliver you a truly exceptional experience.",
    price: '$12.00',
    ctaLabel: 'Order Now',
    heroImage: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=500&fit=crop&q=80',
    ingredients: [
      { emoji: '🥭', style: { top: '8%',   left: '4%',  fontSize: '60px' } },
      { emoji: '🍋', style: { top: '6%',   right: '7%', fontSize: '52px' } },
      { emoji: '🥥', style: { bottom: '20%', right: '4%', fontSize: '58px' } },
      { emoji: '🌿', style: { bottom: '28%', left: '6%', fontSize: '48px' } },
    ],
  },
  {
    id: 'blueberry',
    bgColor: '#6D28D9',
    title: 'Blueberry Bliss',
    description:
      "At Fresh Brewed, we harness the essence of nature's best leaves to deliver you a truly exceptional experience.",
    price: '$12.00',
    ctaLabel: 'Order Now',
    heroImage: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=500&fit=crop&q=80',
    ingredients: [
      { emoji: '🍌', style: { top: '7%',   left: '5%',   fontSize: '58px' } },
      { emoji: '🫐', style: { top: '9%',   right: '8%',  fontSize: '52px' } },
      { emoji: '🫐', style: { bottom: '24%', right: '11%', fontSize: '44px' } },
      { emoji: '🌿', style: { bottom: '30%', left: '7%',  fontSize: '48px' } },
    ],
  },
]

export default {
  title: 'Components/HeroCarousel',
  component: HeroCarousel,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    height: { control: 'text' },
    autoPlay: { control: 'boolean' },
    autoPlayInterval: { control: { type: 'range', min: 1000, max: 8000, step: 500 } },
  },
}

// The default story — matches the reel exactly
export const Default = {
  args: {
    slides: DEMO_SLIDES,
    height: '100vh',
    autoPlay: false,
    transition: {
      duration: 700,
      easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
      content: 'slideLeft',
      background: 'slideDown',
      ingredients: 'slideDown',
    },
  },
}

export const AutoPlay = {
  args: {
    slides: DEMO_SLIDES,
    height: '100vh',
    autoPlay: true,
    autoPlayInterval: 3000,
    transition: {
      duration: 700,
      easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
      content: 'slideLeft',
      background: 'slideDown',
      ingredients: 'slideDown',
    },
  },
}

// Slow-motion — good for debugging the split-axis effect
export const SlowMotion = {
  args: {
    slides: DEMO_SLIDES,
    height: '100vh',
    transition: {
      duration: 1800,
      easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
      content: 'slideLeft',
      background: 'slideDown',
      ingredients: 'slideDown',
    },
  },
}

// All layers fade instead of slide
export const FadeEverything = {
  args: {
    slides: DEMO_SLIDES,
    height: '100vh',
    transition: {
      duration: 600,
      easing: 'ease-in-out',
      content: 'fade',
      background: 'fade',
      ingredients: 'fade',
    },
  },
}

// Content slides up, background slides left
export  const MixedAxes = {
  args: {
    slides: DEMO_SLIDES,
    height: '100vh',
    transition: {
      duration: 700,
      easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
      content: 'slideLeft',
      background: 'slideLeft',
      ingredients: 'slideLeft',
    },
  },
}
