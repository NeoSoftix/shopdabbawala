import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Star, Users, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const dummyUsers = [
  { id: 1, name: "Priya Sharma", role: "Working Professional", rating: 5, text: "The food is always fresh, hygienic and delivered on time. Feels like home-cooked meals every single day!", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
  { id: 2, name: "Rahul Verma", role: "Softw                                                                                                                                                                                                                                                                  are Engineer", rating: 5, text: "I've been with them for 3 months now. Great taste, perfect portions and excellent customer service.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
  { id: 3, name: "Sneha Patil", role: "Student", rating: 5, text: "Best tiffin service in the city! The variety in the menu keeps me excited every single day.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150" },
  { id: 4, name: "Amit Desai", role: "Business Owner", rating: 5, text: "Very hygienic packing and super tasty food. Worth every penny. Highly recommended!", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" },
  { id: 5, name: "Ananya Iyer", role: "UI/UX Designer", rating: 5, text: "The packaging is leak-proof and the spices are very balanced. Ideal for daily office lunch.", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
  { id: 6, name: "Vikram Malhotra", role: "Fitness Trainer", rating: 5, text: "They customized my high-protein meals perfectly. Clean, healthy, and absolutely delicious!", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
  { id: 7, name: "Kriti Joshi", role: "College Student", rating: 5, text: "Pocket-friendly tiffin with amazing taste. Reminds me of my mother's handmade rotis.", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150" },
  { id: 8, name: "Rohan Das", role: "Marketing Manager", rating: 5, text: "On-time delivery even during heavy rains! The customer support is highly professional.", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150" },
  { id: 9, name: "Meera Nair", role: "Banker", rating: 5, text: "Every day there's a new menu item. I never get bored of eating their meals.", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" },
  { id: 10, name: "Deepak Choudhary", role: "Consultant", rating: 5, text: "Super clean presentation and authentic Indian flavors. 10/10 recommendation from my side.", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150" }
];

export default function TestimonialsSlider() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [_, setInit] = useState(false); 

  return (
    <div className="w-full bg-[#FAF9F6] py-16 px-4 md:px-12 font-sans relative overflow-hidden">
      
      {/* हेडिंग सेक्शन */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-1 text-[#9E2A2B] mb-2 text-sm font-semibold tracking-wider">
          <span>•••</span> <span className="uppercase">Testimonials</span> <span>•••</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#2B2D42] mb-3">
          Loved by Thousands, <br className="md:hidden" />
          <span className="text-[#9E2A2B]">Trusted Every Day</span>
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Real reviews from real customers who enjoy our meals and thali service every day.
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto flex items-center gap-4 px-2 md:px-6">
        
        <button 
          ref={prevRef} 
          className="hidden md:flex items-center justify-center min-w-[44px] h-11 rounded-full border border-gray-300 bg-white text-[#9E2A2B] hover:bg-gray-50 shadow-md transition z-20 cursor-pointer text-2xl disabled:opacity-40"
        >
          ‹
        </button>

        <div className="w-full overflow-hidden pb-12">
        <Swiper
  modules={[Navigation, Pagination, Autoplay]}
  spaceBetween={24}
  slidesPerView={1}
  autoplay={{
    delay: 4000,
    disableOnInteraction: false,
  }}
  pagination={{
    clickable: true,
    el: ".custom-pagination",
  }}
  navigation={{
    prevEl: prevRef.current,
    nextEl: nextRef.current,
  }}
  onBeforeInit={(swiper) => {
    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
  }}
  breakpoints={{
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
    1280: {
      slidesPerView: 4,
    },
  }}
>
            {dummyUsers.map((item) => (
              <SwiperSlide key={item.id} className="h-auto py-2">
                <div className="bg-white rounded-2xl p-6 shadow-md border-b-4 border-[#E63946] flex flex-col justify-between h-full relative transition-transform hover:-translate-y-1">
                  
                  {/* कोट्स और स्टार्स */}
                  <div className="mb-4">
                    <div className="text-center text-[#E63946] text-3xl font-serif mb-1">“</div>
                    <div className="flex justify-center gap-1 text-amber-500">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} size={12} className="fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* रिव्यू टेक्स्ट */}
                  <p className="text-gray-700 text-sm text-center font-medium leading-relaxed mb-6 flex-grow">
                    {item.text}
                  </p>

                  {/* यूजर प्रोफाइल */}
                  <div className="flex items-center gap-3 border-t border-gray-100 pt-4 relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="text-left">
                      <h4 className="font-bold text-gray-800 text-xs md:text-sm">{item.name}</h4>
                      <p className="text-[11px] text-gray-500">{item.role}</p>
                    </div>
                    <span className="absolute right-0 bottom-0 text-red-100 text-3xl font-serif pointer-events-none">”</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* कस्टम राइट एरो बटन */}
        <button 
          ref={nextRef} 
          className="hidden md:flex items-center justify-center min-w-[44px] h-11 rounded-full border border-gray-300 bg-white text-[#9E2A2B] hover:bg-gray-50 shadow-md transition z-20 cursor-pointer text-2xl disabled:opacity-40"
        >
          ›
        </button>
      </div>

      {/* इमेज जैसा कस्टमाइज्ड डॉट्स (Pagination) */}
      <div className="custom-pagination flex justify-center gap-2 -mt-4 mb-8"></div>

      {/* बॉटम स्टैटिस्टिक्स बार */}
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-[#701A1C] to-[#9E2A2B] rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-around w-full md:w-3/4 gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><Users size={20} /></div>
            <div className="text-left">
              <div className="text-xl md:text-2xl font-bold">2,500+</div>
              <div className="text-xs text-gray-300">Happy Customers</div>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-[1px] bg-white/20"></div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><Star size={20} className="fill-current" /></div>
            <div className="text-left">
              <div className="text-xl md:text-2xl font-bold">4.8/5</div>
              <div className="text-xs text-gray-300">Average Rating</div>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-[1px] bg-white/20"></div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><ShieldCheck size={20} /></div>
            <div className="text-left">
              <div className="text-xl md:text-2xl font-bold">99%</div>
              <div className="text-xs text-gray-300">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        <div className="text-center md:text-right w-full md:w-auto flex flex-col items-center md:items-end gap-2">
          <span className="text-xs italic font-serif text-amber-200 flex items-center gap-1">Join Our Happy Family <Heart size={12} className="fill-current" /></span>
          <button className="bg-white text-[#9E2A2B] font-bold px-6 py-2.5 rounded-full shadow-md hover:bg-gray-100 transition flex items-center gap-2 text-sm uppercase tracking-wider cursor-pointer">
            Order Now <ArrowRight size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}