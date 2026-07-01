import React from "react";
import { useNavigate } from "react-router-dom";

export default function ThankYouPage({ setShowSuccess }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100/50 p-2 md:p-8 relative overflow-hidden flex flex-col items-center text-center">
        <button
          onClick={() => setShowSuccess(false)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-600 transition-all flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Floating Decorative Elements */}
        <div className="absolute top-8 left-12 w-2 h-2 bg-red-400 rounded-full opacity-60"></div>
        <div className="absolute top-16 left-20 w-4 h-4 text-red-300 opacity-50 select-none">★</div>
        <div className="absolute top-24 left-8 text-red-400 opacity-60 text-xs">♥</div>
        <div className="absolute top-6 right-16 w-2 h-2 bg-red-400 rounded-full opacity-60"></div>
        <div className="absolute top-14 right-8 w-4 h-4 text-red-300 opacity-50 select-none">★</div>
        <div className="absolute top-28 right-12 text-red-400 opacity-60 text-sm">♥</div>

        {/* Success Checkmark Circle */}
        <div className="w-24 h-24 bg-gradient-to-b from-red-50 to-white rounded-full flex items-center justify-center border border-red-100 shadow-inner mb-6 relative">
          <div className="w-20 h-20 rounded-full border border-red-50 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Header Text */}
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-red-600 mb-3 tracking-wide">Thank You!</h1>
        <p className="text-sm md:text-base text-slate-600 font-medium max-w-xs sm:max-w-sm mb-4 leading-relaxed">
          Your order has been placed successfully.
          <br />
          We're excited to fuel your journey to better health!
        </p>

        <div className="flex items-center justify-center w-full space-x-2 mb-6">
          <div className="h-[1px] bg-slate-100 w-12"></div>
          <span className="text-red-500 text-xs">♥</span>
          <div className="h-[1px] bg-slate-100 w-12"></div>
        </div>

        {/* Order Summary Card */}
        <div className="w-full bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-sm text-left mb-6">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 mb-4">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="font-semibold text-slate-800 text-sm md:text-base">Order Summary</h2>
          </div>

          <div className="space-y-3.5 text-xs md:text-sm font-medium mb-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Order ID</span>
              <span className="text-red-600 font-bold">#ORD123456</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Date</span>
              <span className="text-slate-700">24 May 2024, 11:30 AM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Payment Method</span>
              <span className="text-slate-700">Paid Online</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500">Total Amount</span>
              <span className="text-red-600 font-bold text-base md:text-lg">₹699</span>
            </div>
          </div>

          <div className="w-full bg-red-50/50 border border-red-50 rounded-xl p-3 flex items-center space-x-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-[11px] md:text-xs text-slate-600 leading-snug">
              A confirmation email has been sent to your registered email.
            </p>
          </div>
        </div>

        {/* बटन अब लॉगिन पेज (/user/UserLogin) पर भेजेगा */}
        <button 
          onClick={() => navigate("/userlogin")} 
          className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 transition-colors duration-200 shadow-md shadow-red-200 mb-6 group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm md:text-base tracking-wide">Click to Schedule Your Meal</span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}