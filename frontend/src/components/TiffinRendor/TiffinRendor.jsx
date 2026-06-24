import React, { useState } from "react";

const menuItems = [
  {
    id: "thali1",
    name: "MAHARAJA TIFFIN",
    description:
      "A grand feast featuring rich flavors, perfectly balanced spices, and irresistible taste designed to look bold and indulgent.",
    bg: "bg-[#9A3B54]",
    waveColor: "#802E44",
    width: 700,
    textColor: "text-white",
    mainImage: "/thali/thali1image.png",
    thumbImage: "/thali/thali1image.png",
  },
  {
    id: "thali2",
    name: "SPECIAL TIFFIN",
    description:
      "Fresh and healthy home-style tiffin with a variety of delicious curries, breads, and perfect flavors crafted for your daily cravings.",
    bg: "bg-[#D28C28]",
    waveColor: "#B87820",
    width: 900,
    textColor: "text-white",
    mainImage: "/thali/thali2image.png",
    thumbImage: "/thali/thali2image.png",
  },
  {
    id: "thali3",
    name: "CLASSIC TIFFIN",
    description:
      "Traditional home-cooked style meals with comforting textures, rich flavors, and irresistible satisfaction for your hunger.",
    bg: "bg-[#5D4037]",
    waveColor: "#4A332C",
    width: 500,
    textColor: "text-[#F5F5DC]",
    mainImage: "/thali/thali3image.png",
    thumbImage: "/thali/thali3image.png",
  },
];

export default function TiffinRendor() {
  const [activeItem, setActiveItem] = useState(menuItems[0]);

  return (
    <>
      {/* Custom CSS Animation for the Plate (Thali) */}
      <style>
        {`
          @keyframes plate-reveal {
            0% {
              opacity: 0;
              transform: translateX(100px) rotate(45deg) scale(0.8);
            }
            100% {
              opacity: 1;
              transform: translateX(0) rotate(0deg) scale(1);
            }
          }
          .animate-plate {
            animation: plate-reveal 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
        `}
      </style>

      {/* Pura page cover karega: h-screen (100vh), w-screen, overflow-hidden */}
      <div
        className={`relative h-screen w-screen overflow-hidden transition-colors duration-700 ease-in-out ${activeItem.bg} font-sans`}
      >
        {/* Background Wavy Shape (Left Side) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <svg
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,0 L450,0 C500,100 550,200 500,300 C450,400 550,500 550,600 L0,600 Z"
              fill={activeItem.waveColor}
              className="transition-colors duration-700 ease-in-out"
            />
          </svg>
        </div>

        {/* Left Side Content Area (Text & Thumbnails vertically centered) */}
        <div className="absolute top-1/2 left-12 md:left-24 -translate-y-1/2 z-10 max-w-xl md:max-w-2xl">
          {/* Title */}
          <h1
            key={`title-${activeItem.id}`} // Adds a quick snap effect to text change
            className={`text-6xl md:text-8xl font-black tracking-wide mb-6 drop-shadow-lg leading-tight uppercase ${activeItem.textColor}`}
          >
            {activeItem.name}
          </h1>

          {/* Description */}
          <p
            className={`text-lg md:text-xl font-medium leading-relaxed mb-10 opacity-95 ${activeItem.textColor}`}
          >
            {activeItem.description}
          </p>

          {/* Circular Thumbnails */}
          <div className="flex gap-5">
            {menuItems.map((item) => {
              const isActive = activeItem.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-[3px] shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform focus:outline-none
                    ${
                      isActive
                        ? "border-white scale-110 ring-4 ring-white/40"
                        : "border-transparent scale-100 opacity-70 hover:opacity-100 hover:scale-105"
                    }`}
                >
                  <img
                    src={item.thumbImage}
                    alt={item.name}
                    className="w-full h-full object-cover bg-black/10"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Bottom Main Thali Image */}
        <div className="absolute -bottom-10 -right-[30%] md:bottom-5 md:right-10 z-20 flex justify-center items-center pointer-events-none">
          <div className="absolute bottom-5 right-0 w-[800px] h-[800px] flex items-center justify-center">
            <img
              key={activeItem.id}
              src={activeItem.mainImage}
              style={{ width: activeItem.width }}
              className="animate-plate object-contain"
            />
          </div>
        </div>
      </div>
    </>
  );
}
