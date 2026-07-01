import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 bg-white text-gray-900 font-sans antialiased">
      
      {/* Subtle Red Grid Background Accent */}
      <div className="absolute inset-0 z-0 opacity-5 bg-[linear-gradient(to_right,#ef4444_1px,transparent_1px),linear-gradient(to_bottom,#ef4444_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Decorative Red Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500 rounded-full blur-[120px] opacity-10 z-0" />

      {/* Main Content Box */}
      <div className="text-center z-10 max-w-xl">
        
        {/* Error Code Graphic */}
        <div className="relative inline-block">
          <h1 className="text-[12rem] font-black tracking-tighter text-red-600 leading-none select-none sm:text-[16rem]">
            404
          </h1>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-4 py-1 text-xs uppercase tracking-widest font-semibold border border-red-200 text-red-600 rounded-full shadow-sm whitespace-nowrap">
            Error Detected
          </span>
        </div>

        {/* Message */}
        <h2 className="mt-8 text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
          Lost in the red zone?
        </h2>
        <p className="mt-4 text-base text-gray-600 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 shadow-md shadow-red-600/10 cursor-pointer"
          >
            Go Back Home
          </button>
          <button 
            onClick={() => window.location.href = '/support'}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border-2 border-red-600 text-base font-medium rounded-lg text-red-600 bg-transparent hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 cursor-pointer"
          >
            Contact Support
          </button>
        </div>
        
      </div>

      {/* Footer Note */}
      <div className="absolute bottom-6 z-10 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
      </div>

    </div>
  );
};

export default NotFoundPage;