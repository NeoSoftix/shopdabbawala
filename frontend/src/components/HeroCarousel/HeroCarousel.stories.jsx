  import HeroCarousel from './HeroCarousel'
  // Demo slides matching the Instagram reel screenshots.
  // heroImage: swap these URLs for your real food photos.
  // ingredients: use { src, style } for real images, or { emoji, style } for quick demos.
  export const DEMO_SLIDES = [
    {
      id: 'meal Thali',
      bgColor: '#E8574A',
      title: 'Meal Thali',
      description:
        "At Fresh Brewed, we harness the essence of nature's best leaves to deliver you a truly exceptional experience.",
      price: '$12.00',
      ctaLabel: 'Order Now',
      heroImage: '/thali/thali1image.png',
      ingredients: [
        { src: '/ingredients/strawberry.webp', style: { top: '6%',  right: '10%', width: '90px' } },
        { src: '/ingredients/kiwi.png', style: { top: '20%', right: '3%',  width: '90px' } },
        { src: '/ingredients/mango.png', style: { bottom: '22%', right: '9%', width: '90px' } },
        { src: '/ingredients/strawberry.webp', style: { top: '8%',  left: '5%',  width: '90px' } },
      ],
    },
    {
      id: 'premium thali',
      bgColor: '#F5A623',
      title: 'Premium Thali',
      description:
        "At Fresh Brewed, we harness the essence of nature's best leaves to deliver you a truly exceptional experience.",
      price: '$12.00',
      ctaLabel: 'Order Now',
      heroImage: '/thali/thali2image.png',
      ingredients: [
        { src: '/ingredients/blueberry.webp', style: { top: '8%',   left: '4%',  width: '90px' } },
        { src: '/ingredients/mango.png', style: { top: '6%',   right: '7%', width: '92px' } },
        { src: '/ingredients/strawberry.webp', style: { bottom: '20%', right: '4%', width: '98px' } },
        { src: '/ingredients/kiwi.png', style: { bottom: '40%', left: '6%', width: '98px' } },
      ],
    },
    {
      id: 'protein thali',
      bgColor: '#6D28D9',
      title: 'Protein Thali',
      description:
        "At Fresh Brewed, we harness the essence of nature's best leaves to deliver you a truly exceptional experience.",
      price: '$12.00',
      ctaLabel: 'Order Now',
      heroImage: '/thali/thali3image.png',
      ingredients: [
        { src: '/ingredients/mango.png', style: { top: '7%',   left: '5%',   width: '98px' } },
        { src: '/ingredients/kiwi.png', style: { top: '9%',   right: '8%',  width: '92px' } },
        { src: '/ingredients/strawberry.webp', style: { bottom: '24%', right: '11%', width: '94px' } },
        { src: '/ingredients/coconut.png', style: { bottom: '40%', left: '7%',  width: '98px' } },
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
