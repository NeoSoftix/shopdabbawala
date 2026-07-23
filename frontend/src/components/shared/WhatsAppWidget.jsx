import React from 'react';
import { FaWhatsapp } from "react-icons/fa6";

const WhatsAppWidget = () => {
  // We'll use the Sandbox number for now. In production, this will be your actual business number.
  const whatsappNumber = "14155238886";
  const defaultMessage = "Hi, I want to know about my Tiffin Plan.";
  
  // Create the wa.me link
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={22} />
      
      {/* Tooltip that shows on hover */}
      <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm py-2 px-4 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none border border-gray-100">
        Chat with us!
        {/* Little triangle pointer for tooltip */}
        <span className="absolute top-1/2 -right-2 transform -translate-y-1/2 border-8 border-transparent border-l-white"></span>
      </span>
    </a>
  );
};

export default WhatsAppWidget;
