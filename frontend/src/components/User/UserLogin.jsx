import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserLogin() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  // जब यूज़र पहला बटन दबाकर OTP रिक्वेस्ट करेगा
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    // वास्तविक प्रोजेक्ट में यहाँ OTP भेजने की API कॉल होगी
    setIsOtpSent(true);
    setMessage("OTP sent successfully to your phone number!");
  };

  // फाइनल सबमिट करने पर
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length < 4) {
      alert("Please enter a valid OTP");
      return;
    }

    setMessage("✓ Verification Successful! Redirecting...");

    // 2 सेकंड बाद मील-प्लानर पेज पर रीडायरेक्ट कर देगा
    setTimeout(() => {
      navigate("/meal-planner");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 flex flex-col">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight uppercase mb-1 text-center">
          Verify Identity
        </h2>
        <p className="text-gray-500 text-xs mb-6 text-center leading-relaxed">
          Please verify your phone number to manage and schedule your meals.
        </p>

        {/* मैसेज डिस्प्ले बॉक्स */}
        {message && (
          <div className={`p-3 rounded-xl text-xs text-center mb-4 font-bold ${message.includes("Successful") ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
            {message}
          </div>
        )}

        {/* फोन नंबर डालने का फॉर्म */}
        <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black tracking-wider text-gray-600 uppercase mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              disabled={isOtpSent} // ओटीपी जाने के बाद फोन नंबर लॉक हो जाएगा
              placeholder="Enter 10 digit number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} // सिर्फ नंबर्स अलाउ करने के लिए
              className="w-full bg-white disabled:bg-slate-50 border border-gray-300 rounded-xl p-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]"
            />
          </div>

          {/* ओटीपी फ़ील्ड: केवल तभी दिखेगी जब फोन नंबर सबमिट हो चुका हो */}
          {isOtpSent && (
            <div className="transition-all duration-300">
              <label className="block text-[11px] font-black tracking-wider text-gray-600 uppercase mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="Enter verification code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#dc2626] text-white py-2.5 rounded-xl text-xs font-black tracking-widest uppercase shadow-sm hover:bg-[#b91c1c] transition-all active:scale-[0.98] focus:outline-none"
          >
            {isOtpSent ? "Verify & Proceed" : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}