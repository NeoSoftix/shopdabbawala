import React, { useState } from 'react';
// 1. Yahan apni image ko direct import karo
import faqBackground from "../../assets/faqbg.png"; // Path check kar lena agar aapki file kisi aur folder mein hai
import { useNavigate } from 'react-router-dom';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const navigate = useNavigate()

  const faqData = [
    {
      id: 1,
      question: "What areas do you deliver to?",
      answer: "We currently deliver to most areas in the city. You can enter your location on our checkout page to check if we deliver to your area.",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: 2,
      question: "What types of meal plans do you offer?",
      answer: "We offer a variety of meal plans including daily, weekly, and monthly subscriptions for single meals, corporate catering, and full family thalis.",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 3,
      question: "Can I customize my meal or thali?",
      answer: "Yes, you can customize your preferences, choose specific dishes, or mention dietary restrictions during the subscription setup.",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      )
    },
    {
      id: 4,
      question: "How do I place an order?",
      answer: "Simply choose your preferred meal plan, select your delivery address, customize your items if needed, and proceed to secure checkout.",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 5,
      question: "What are your delivery timings?",
      answer: "Our lunch deliveries happen between 11:30 AM to 1:30 PM, and dinner deliveries are carried out between 7:30 PM to 9:30 PM.",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 6,
      question: "How can I make a payment?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and popular digital wallets.",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      id: 7,
      question: "Can I pause or cancel my subscription?",
      answer: "Yes, you can pause or cancel your meal subscription anytime directly from your dashboard before the daily cutoff time.",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 8,
      question: "What if I am not satisfied with the food?",
      answer: "Customer satisfaction is our priority. If you encounter any issues, please contact our support team immediately, and we will resolve it.",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat font-sans py-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between"
      // 2. Yahan imported variable ko use karo
      style={{ backgroundImage: `url(${faqBackground})` }}
    >
      {/* Top Food Thali Image Accent */}
      {/* <div className="absolute top-0 left-0 w-32 sm:w-48 md:w-64 lg:w-80 pointer-events-none hidden md:block">
        <img src="https://i.imgur.com/G496Xgq.png" alt="Thali Accent" className="w-full h-auto opacity-90" />
      </div> */}

      <div className="max-w-4xl w-full z-10 flex-grow">
        {/* Header Section */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center space-x-2 mb-2">
            <span className="h-[1px] w-6 bg-red-600"></span>
            <span className="bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              🍳 FAQ
            </span>
            <span className="h-[1px] w-6 bg-red-600"></span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800">
            Frequently Asked <span className="text-red-600">Questions</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-md mx-auto">
            Find answers to common questions about our meal, tiffin & thali services.
          </p>

          <div className="flex items-center justify-center space-x-4 mt-4">
            <span className="h-[1px] w-16 bg-red-300"></span>
            <span className="text-red-600 text-lg">🍴</span>
            <span className="h-[1px] w-16 bg-red-300"></span>
          </div>
        </div>

        {/* FAQ Accordion Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 sm:p-8 shadow-xl border border-gray-100 max-w-10xl mx-auto">
          <div className="space-y-3">
            {faqData.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={faq.id} 
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen ? 'border-red-100 bg-white shadow-sm' : 'border-gray-100 bg-gray-50/50'
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-4 text-left focus:outline-none transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2.5 rounded-full transition-colors ${
                        isOpen ? 'bg-red-600 text-white' : 'bg-white text-red-600 border border-gray-100 shadow-sm'
                      }`}>
                        {React.cloneElement(faq.icon, { className: `w-5 h-5 ${isOpen ? 'text-white' : 'text-red-600'}` })}
                      </div>
                      <span className="font-bold text-gray-800 text-sm sm:text-base">
                        {faq.id}. {faq.question}
                      </span>
                    </div>

                    <div className="ml-2 flex-shrink-0">
                      <svg 
                        className={`w-5 h-5 text-red-600 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-40 border-t border-red-50 bg-red-50/30' : 'max-h-0'
                    }`}
                  >
                    <p className="p-4 pl-16 text-gray-600 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Support Banner */}
      <div className="w-full max-w-3xl bg-red-600 rounded-3xl mt-12 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between shadow-lg text-white gap-6 z-10">
        <div className="flex items-center space-x-4 text-center sm:text-left flex-col sm:flex-row">
          <div className="bg-white/20 p-4 rounded-full mb-3 sm:mb-0">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <h4 className="text-xl font-bold">Still have questions?</h4>
            <p className="text-red-100 text-sm mt-0.5">We're here to help! Reach out to our support team.</p>
          </div>
        </div>
        
        <button className="bg-white text-gray-800 hover:bg-gray-100 transition font-bold px-6 py-3 rounded-xl flex items-center space-x-2 text-sm shadow-md whitespace-nowrap">
          <span className="text-red-600">📞</span>
          <span onClick={() => navigate("/contact-us  ")}>Contact Us</span>
        </button>
      </div>
    </div>
  );
};

export default FAQSection;