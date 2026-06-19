import React, { useState } from 'react';

export default function CreatePackage() {
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
    // Side padding kam ki hai (px-2 sm:px-4) aur main wrapper ko full width space dene ke liye modify kiya hai
    <div className="bg-[#f9f9fb] text-gray-800 font-sans antialiased min-h-screen py-10 px-2 sm:px-4 lg:px-6">
      {/* max-w-full kiya hai aur inner padding (p-6 sm:p-8) badha di hai */}
      <main className="max-w-full mx-auto bg-white/50 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Title Area */}
        <div className="mb-8 px-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Create Your Plan
          </h1>
          <p className="text-gray-500 text-[14px] max-w-3xl leading-relaxed">
            Customize your culinary journey with premium ingredients delivered to your doorstep. Healthy, chef-prepared meals tailored to your urban lifestyle.
          </p>
        </div>

        {/* Layout Grid - Grid gap thoda fit kiya hai space manage karne ke liye */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Configurator Side */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Row 1: Preference & Timing */}
            {/* Cards ki internal padding p-6 se badha kar p-8 ki hai */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Meal Preference */}
                <div>
                  <label className="text-[13px] font-semibold text-[#dc2626] flex items-center gap-1.5 mb-3">
                    <span>🍴</span> Meal Preference
                  </label>
                  <div className="bg-[#f3f4f6] p-1 rounded-xl flex border border-gray-100">
                    <button 
                      onClick={() => setPreference('Veg')}
                      className={`w-1/2 py-2.5 rounded-lg text-sm font-bold text-center transition-all ${preference === 'Veg' ? 'bg-[#dc2626] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200/60'}`}
                    >
                      Veg
                    </button>
                    <button 
                      onClick={() => setPreference('Non-Veg')}
                      className={`w-1/2 py-2.5 rounded-lg text-sm font-bold text-center transition-all ${preference === 'Non-Veg' ? 'bg-[#dc2626] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200/60'}`}
                    >
                      Non-Veg
                    </button>
                  </div>
                </div>
                
                {/* Meal Timing */}
                <div>
                  <label className="text-[13px] font-semibold text-[#dc2626] flex items-center gap-1.5 mb-3">
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
            <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
              {/* Duration Selectors */}
              <div>
                <label className="text-[13px] font-semibold text-[#dc2626] flex items-center gap-1.5 mb-3">
                  <span>📅</span> Duration
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['1 Meal', 'Weekly', 'Monthly', 'Quarterly'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`py-3 rounded-xl text-sm font-medium border text-center transition-all ${duration === d ? 'border-2 border-[#dc2626] text-[#dc2626] bg-red-50/20 font-semibold' : 'border-gray-200 text-gray-500 bg-white hover:border-[#dc2626]'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Meals Grid */}
              <div>
                <label className="text-[13px] font-semibold text-[#dc2626] flex items-center gap-1.5 mb-3">
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
                      className={`p-5 rounded-xl text-center border transition-all flex flex-col items-center justify-center ${totalMeals === option.count ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'bg-white text-gray-800 border-gray-200 hover:border-[#dc2626]'}`}
                    >
                      <div className="text-xl font-bold mb-0.5">{option.count}</div>
                      <div className={`text-xs font-semibold ${totalMeals === option.count ? 'text-white' : 'text-gray-700'}`}>{option.price} / meal</div>
                      <div className={`text-[11px] mt-1 font-medium ${totalMeals === option.count ? 'text-white/80' : 'text-gray-400'}`}>{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Start Date & Tiffins */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Start Date */}
                <div>
                  <label className="text-[13px] font-semibold text-[#dc2626] flex items-center gap-1.5 mb-3">
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
                  <label className="text-[13px] font-semibold text-[#dc2626] flex items-center gap-1.5 mb-3">
                    <span>🔢</span> Number of Tiffins
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTiffins(t)}
                        className={`py-3 rounded-xl text-sm font-bold text-center transition-all ${tiffins === t ? 'bg-[#dc2626] text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-[#dc2626]'}`}
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
          <div className="space-y-4 lg:sticky lg:top-6">
            {/* Sidebar padding p-6 se p-8 badha di */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              
              {/* Card Title */}
              <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
                <div className="bg-red-50 p-2 rounded-lg text-[#dc2626]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
                <h2 className="text-[15px] font-bold text-gray-800">Plan Summary</h2>
              </div>

              {/* Specification Table */}
              <div className="py-4 space-y-3.5 text-xs font-medium border-b border-gray-100 text-gray-600">
                <div className="flex justify-between">
                  <span className="text-gray-400">Meal preference</span>
                  <span className="font-bold text-gray-900">{preference === 'Veg' ? 'Vegetarian' : 'Non-Vegetarian'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery timing</span>
                  <span className="font-bold text-gray-900">{timing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="font-bold text-gray-900">{duration === 'Monthly' ? '1 month' : duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tiffins per meal</span>
                  <span className="font-bold text-gray-900">{tiffins}</span>
                </div>
              </div>

              {/* Computations Box */}
              <div className="bg-[#f3f4f6]/70 p-4 rounded-xl my-4 space-y-2.5">
                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>Subtotal ({totalMeals} meals)</span>
                  <span className="font-semibold text-gray-700">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-[#dc2626]">
                  <span>Discount (20% off)</span>
                  <span className="font-semibold">-${discount.toFixed(2)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-bold text-gray-800">Total Amount</span>
                  <span className="text-3xl font-black text-[#dc2626]">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Status Tag */}
              <div className="bg-red-50/70 border border-red-100/80 text-[#dc2626] text-[11px] rounded-lg p-2 text-center font-semibold mb-4 flex items-center justify-center space-x-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Effective Price per Tiffin: ${pricePerMeal}</span>
              </div>

              {/* Action Trigger */}
              <button className="w-full bg-[#dc2626] text-white h-12 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-sm hover:bg-[#b91c1c] transition-all active:scale-[0.99]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
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