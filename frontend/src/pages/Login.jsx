import {
  FaGoogle,
  FaApple,
  FaRegEnvelope,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";

export default function Login() {
  return (
    <div className="min-h-screen bg-[#f5f2f3] flex items-center justify-center p-5">
      <div className="w-full max-w-[1450px] bg-[#f8f4f5] rounded-[35px] shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="relative flex items-center justify-center min-h-[850px]">

            {/* Background Circle */}
            <div className="absolute w-[480px] h-[480px] bg-red-600 rounded-full left-16 top-[220px]" />

            {/* Decorative Dots */}
            <div className="absolute top-10 left-10 grid grid-cols-4 gap-3">
              {[...Array(16)].map((_, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-red-200"
                />
              ))}
            </div>

            <div className="absolute bottom-10 right-10 grid grid-cols-4 gap-3">
              {[...Array(16)].map((_, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-red-300"
                />
              ))}
            </div>

            {/* Phone Image */}
            <img
              src="/login-ph.png"
              alt="phone"
              className="relative z-10 w-[580px] object-contain"
            />

            {/* Floating Card */}
            <div className="absolute z-20 right-16 top-[420px] bg-white rounded-3xl px-6 py-5 shadow-xl flex items-center gap-4">
              <span className="text-3xl">🛵</span>

              <div>
                <h4 className="font-semibold text-lg">
                  Hot Meals
                </h4>

                <p className="text-gray-500 text-sm">
                  Delivered Fast
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-10">
            <div className="bg-white rounded-[40px] shadow-lg min-h-[850px] flex flex-col justify-center px-12">

              {/* Logo */}
              <div className="mx-auto w-24 h-24 rounded-full bg-red-600 flex items-center justify-center text-white text-4xl shadow-lg">
                🍽️
              </div>

              {/* Heading */}
              <h1 className="text-center text-[64px] font-extrabold mt-8">
                Welcome{" "}
                <span className="text-red-600">
                  Back!
                </span>
              </h1>

              <p className="text-center text-gray-500 text-2xl mt-4 leading-relaxed">
                Login with your phone number
                <br />
                to continue
              </p>

              {/* Input */}
              <div className="mt-12 border-2 border-gray-200 rounded-[24px] overflow-hidden flex h-[90px]">
                <div className="w-[220px] border-r border-gray-200 flex items-center justify-center gap-3 text-2xl font-semibold">
                  🇵🇰 +92
                </div>

                <input
                  type="text"
                  placeholder="Enter your phone number"
                  className="flex-1 outline-none px-8 text-2xl"
                />
              </div>

              {/* Button */}
              <button className="mt-8 h-[90px] bg-red-600 hover:bg-red-700 transition rounded-full text-white text-3xl font-semibold flex items-center justify-center gap-5">
                Send OTP

                <span className="w-14 h-14 rounded-full bg-white text-red-600 flex items-center justify-center">
                  <FaArrowRight />
                </span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-5 my-12">
                <div className="flex-1 h-px bg-gray-200"></div>

                <span className="text-gray-500 text-xl">
                  or continue with
                </span>

                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Social */}
              <div className="flex justify-center gap-8">
                <button className="w-24 h-24 rounded-full bg-white shadow-lg text-4xl flex items-center justify-center">
                  <FaGoogle />
                </button>

                <button className="w-24 h-24 rounded-full bg-white shadow-lg text-4xl flex items-center justify-center">
                  <FaApple />
                </button>

                <button className="w-24 h-24 rounded-full bg-white shadow-lg text-4xl flex items-center justify-center text-red-600">
                  <FaRegEnvelope />
                </button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-3 mt-16 text-gray-500 text-xl">
                <FaShieldAlt className="text-red-600" />

                <span>
                  100% Secure • Only phone number required
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}