import React from "react";
import { 
  LuUtensils, 
  LuLeaf, 
  LuChefHat, 
  LuBike, 
  LuCalendarDays, 
  LuHeartHandshake,
  LuUsers,
  LuMapPin,
  LuStar
} from "react-icons/lu";
import { BiDish } from "react-icons/bi";

const features = [
  {
    icon: LuUtensils,
    title: "Hygienic & Safe",
    desc: "Prepared in a clean and hygienic kitchen. Your health is our priority."
  },
  {
    icon: LuLeaf,
    title: "Fresh & Quality Ingredients",
    desc: "We use only fresh and high-quality ingredients for every meal."
  },
  {
    icon: LuChefHat,
    title: "Home Style Taste",
    desc: "Enjoy delicious, home-style cooked meals that bring comfort in every bite."
  },
  {
    icon: LuBike,
    title: "On-Time Delivery",
    desc: "We value your time. Get your meals delivered hot and on time."
  },
  {
    icon: LuCalendarDays,
    title: "Flexible Plans",
    desc: "Choose from a variety of plans that fit your schedule and needs."
  },
  {
    icon: LuHeartHandshake,
    title: "Customer First",
    desc: "We're here for you! Quick support and 100% customer satisfaction."
  }
];

// const stats = [
//   { icon: LuUsers, value: "5000+", label: "Happy Customers" },
//   { icon: BiDish, value: "50+", label: "Daily Meal Options" },
//   { icon: LuMapPin, value: "15+", label: "Areas We Serve" },
//   { icon: LuStar, value: "4.8/5", label: "Customer Ratings", isStar: true }
// ];

export default function WhyChooseUs() {
  return (
    <section 
      className="relative min-h-screen w-full pt-8 pb-6 md:pt-12 md:pb-8 bg-white bg-no-repeat bg-center bg-cover xl:bg-[length:100%_100%] select-none flex flex-col justify-between"
      style={{ backgroundImage: "url('/WhyChooseUsImage.png')" }}
    >
      {/* लाइट ओवरले */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full flex-1 flex flex-col justify-between gap-8">
        
        {/* ================= HEADING HEADER BLOCK ================= */}
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-slate-300 text-xs">─</span>
            <span className="bg-[#E23747] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              Why Choose Us
            </span>
            <span className="text-slate-300 text-xs">─</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Why Choose <span className="text-[#E23747]">Us?</span>
          </h2>

          <div className="flex items-center gap-3 mt-2 w-full justify-center">
            <div className="w-12 h-[1px] bg-slate-200" />
            <span className="text-[#E23747] text-base">🍴</span>
            <div className="w-12 h-[1px] bg-slate-200" />
          </div>

          <p className="text-gray-500 mt-2 text-xs md:text-sm font-medium max-w-lg leading-relaxed">
            We are committed to providing healthy, delicious and hygienic meals that feel just like home.
          </p>
        </div>

        {/* ================= MAIN CONTENT SECTION (GRID OVER BACKGROUND) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
          
          {/* LEFT SIDE: FEATURES GRID (Bigger Cards - changed to 2 columns on desktop) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            {features.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white/95 backdrop-blur-sm border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.025)] flex flex-col items-center text-center justify-between min-h-[230px] md:min-h-[250px] transition-all duration-300 hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] hover:-translate-y-1"
                >
                  {/* Bigger Icon Holder */}
                  <div className="w-16 h-16 rounded-full bg-[#FFF2F3] flex items-center justify-center text-[#E23747] mb-4 shadow-sm">
                    <IconComponent className="w-7 h-7 stroke-[2]" />
                  </div>

                  {/* Text Contents with larger titles */}
                  <div className="flex-1 flex flex-col justify-center w-full">
                    <h3 className="text-[17px] md:text-[18px] font-black text-slate-900 tracking-tight mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-xs md:text-[13px] font-medium leading-relaxed max-w-[220px] mx-auto">
                      {item.desc}
                    </p>
                  </div>

                  {/* Bottom Bold Red Dash */}
                  <div className="w-8 h-[3px] bg-red-500 rounded-full mt-4" />
                </div>
              );
            })}
          </div>

          {/* RIGHT SIDE CONTAINER (Kept clean for background plate artwork) */}
          <div className="hidden lg:col-span-5 lg:block h-full min-h-[400px] xl:min-h-[480px]" />

        </div>
      </div>
    </section>
  );
}