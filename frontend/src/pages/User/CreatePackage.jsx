import React, { useState } from 'react';

// Note: Agar aap popup modal ke andar render kar rahe ho, toh is `onClose` prop ka use cross-button par kar sakte ho!
export default function CreatePackage({ onClose }) {
  // State variables management
  const [preference, setPreference] = useState('Veg');
  const [timing, setTiming] = useState('Lunch');
  const [duration, setDuration] = useState('Monthly');
  const [totalMeals, setTotalMeals] = useState(16);
  const [startDate, setStartDate] = useState('2026-06-17');
  const [tiffins, setTiffins] = useState(1);

  // Price Calculation Logic based on exact image layout
  const pricePerMeal = totalMeals === 16 ? 11.95 : totalMeals === 20 ? 11.50 : 10.95;
  const subtotal = totalMeals * pricePerMeal;
  const discount = subtotal * 0.20; // 20% Off
  const totalAmount = subtotal - discount;

  return (
    <div className="bg-[#f9f9fb] text-gray-800 font-sans antialiased min-h-screen py-6 px-2 sm:px-4 lg:px-6 relative">
      
      {/* Agar page ke andar modal close target chahiye toh close trigger button code layout handle kar sakta hai */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <main className="max-w-full mx-auto bg-white/50 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm">
        
        {/* Title Area */}
        <div className="mb-8 px-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2 uppercase">
            Create Your Plan
          </h1>
          <p className="text-gray-500 text-[14px] max-w-3xl leading-relaxed">
            Customize your culinary journey with premium ingredients delivered to your doorstep. Healthy, chef-prepared meals tailored to your urban lifestyle.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Configurator Side */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Row 1: Preference & Timing */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Meal Preference */}
                <div>
                  <label className="text-[13px] font-semibold text-[#dc2626] flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                    <span>🍴</span> Meal Preference
                  </label>
                  <div className="bg-[#f3f4f6] p-1 rounded-xl flex border border-gray-100">
                    <button 
                      onClick={() => setPreference('Veg')}
                      className={`w-1/2 py-2.5 rounded-lg text-sm font-bold text-center transition-all focus:outline-none ${preference === 'Veg' ? 'bg-[#dc2626] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200/60'}`}
                    >
                      Veg
                    </button>
                    <button 
                      onClick={() => setPreference('Non-Veg')}
                      className={`w-1/2 py-2.5 rounded-lg text-sm font-bold text-center transition-all focus:outline-none ${preference === 'Non-Veg' ? 'bg-[#dc2626] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200/60'}`}
                    >
                      Non-Veg
                    </button>
                  </div>
                </div>
                
                {/* Meal Timing */}
                <div>
                  <label className="text-[13px] font-semibold text-[#dc2626] flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                    <span>🕒</span> Meal Timing
                  </label>
                  <div className="relative">
                    <select 
                      value={timing}
                      onChange={(e) => setTiming(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] appearance-none"
                    >
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Both">Both</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-500">
                      <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Duration & Total Meals */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
              {/* Duration Selectors */}
              <div>
                <label className="text-[13px] font-semibold text-[#dc2626] flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                  <span>📅</span> Duration
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['1 Meal', 'Weekly', 'Monthly', 'Quarterly'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`py-3 rounded-xl text-sm font-bold border text-center transition-all focus:outline-none ${duration === d ? 'border-2 border-[#dc2626] text-[#dc2626] bg-red-50/20 font-black' : 'border-gray-200 text-gray-400 bg-white hover:border-[#dc2626] hover:text-slate-800'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Meals Grid */}
              <div>
                <label className="text-[13px] font-semibold text-[#dc2626] flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                  <span>🍱</span> Total Meals
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { count: 16, price: '$11.95', label: '4 Meals / Week' },
                    { count: 20, price: '$11.50', label: '5 Meals / Week' },
                    { count: 24, price: '$10.95', label: '6 Meals / Week' }
                  ].map((option) => (
                    <button
                      key={option.count}
                      onClick={() => setTotalMeals(option.count)}
                      className={`p-5 rounded-2xl text-center border transition-all flex flex-col items-center justify-center focus:outline-none ${totalMeals === option.count ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-md shadow-red-500/10' : 'bg-white text-gray-800 border-gray-200 hover:border-[#dc2626]'}`}
                    >
                      <div className="text-2xl font-black mb-0.5">{option.count}</div>
                      <div className={`text-xs font-bold ${totalMeals === option.count ? 'text-white' : 'text-gray-600'}`}>{option.price} / meal</div>
                      <div className={`text-[10px] mt-1 font-bold uppercase tracking-wide ${totalMeals === option.count ? 'text-white/80' : 'text-gray-400'}`}>{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Start Date & Tiffins */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Start Date */}
                <div>
                  <label className="text-[13px] font-semibold text-[#dc2626] flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                    <span>📅</span> Start Date
                  </label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]" 
                  />
                </div>

                {/* Number of Tiffins */}
                <div>
                  <label className="text-[13px] font-semibold text-[#dc2626] flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                    <span>🔢</span> Number of Tiffins
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTiffins(t)}
                        className={`py-3 rounded-xl text-sm font-black text-center transition-all focus:outline-none ${tiffins === t ? 'bg-[#dc2626] text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-400 hover:border-[#dc2626] hover:text-slate-800'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-6 relative z-10">
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              
              {/* Card Title */}
              <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
                <div className="bg-red-50 p-2 rounded-lg text-[#dc2626]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
                <h2 className="text-base font-black text-slate-800 uppercase tracking-wide">Plan Summary</h2>
              </div>

              {/* Specification Table */}
              <div className="py-4 space-y-3.5 text-xs font-bold border-b border-gray-100 text-slate-600 uppercase tracking-wide">
                <div className="flex justify-between">
                  <span className="text-gray-400">Meal preference</span>
                  <span className="text-slate-900">{preference === 'Veg' ? 'Vegetarian' : 'Non-Vegetarian'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery timing</span>
                  <span className="text-slate-900">{timing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-slate-900">{duration === 'Monthly' ? '1 month' : duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tiffins per meal</span>
                  <span className="text-slate-900">{tiffins}</span>
                </div>
              </div>

              {/* Computations Box */}
              <div className="bg-[#f4f5f7] p-4 rounded-2xl my-4 space-y-3">
                <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wide">
                  <span>Subtotal ({totalMeals} meals)</span>
                  <span className="text-slate-700">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-[#dc2626] uppercase tracking-wide">
                  <span>Discount (20% off)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wide">Total Amount</span>
                  <span className="text-3xl font-black text-[#dc2626] tracking-tight">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Status Tag */}
              <div className="bg-red-50 border border-red-100 text-[#dc2626] text-[10px] rounded-xl p-2.5 text-center font-black uppercase tracking-widest mb-4 flex items-center justify-center space-x-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Price per Tiffin: ${pricePerMeal}</span>
              </div>

              {/* Action Trigger */}
              <button className="w-full bg-[#dc2626] text-white h-13 rounded-xl text-xs font-black tracking-widest uppercase flex items-center justify-center space-x-2 shadow-sm hover:bg-[#b91c1c] transition-all active:scale-[0.98] focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75 .75 0 11-1.5 0 .75 .75 0 011.5 0zm12.75 0a.75 .75 0 11-1.5 0 .75 .75 0 011.5 0z" />
                </svg>
                <span>Proceed to Checkout</span>
              </button>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}