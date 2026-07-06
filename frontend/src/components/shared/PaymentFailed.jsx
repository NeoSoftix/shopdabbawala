import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 flex items-center justify-center p-4 antialiased">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 250, damping: 22 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-8 text-center relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-rose-400 to-red-500" />
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-50 rounded-full opacity-60" />
        <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-rose-50 rounded-full opacity-60" />

        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-100 relative z-10"
        >
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.div>

        <div className="relative z-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Payment Failed
          </h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
            Oops! Something went wrong with your transaction and the payment could not be processed. No charges were made.
          </p>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-8 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-red-800 text-xs font-semibold leading-relaxed">
                Please double-check your payment details or try using a different payment method to complete your subscription.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-black text-xs tracking-widest uppercase py-4 rounded-2xl transition-all shadow-lg shadow-slate-200"
            >
              Try Again
            </button>
            
            <button
              onClick={() => navigate("/")}
              className="w-full bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-500 hover:text-slate-700 font-bold text-xs tracking-widest uppercase py-4 rounded-2xl transition-all border border-slate-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
