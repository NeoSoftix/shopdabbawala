import { useState } from "react";
import { Mail, Lock, ShieldCheck, Clock3 } from "lucide-react";
import RoleSelector from "../components/RoleSelector";

export default function Login() {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      role,
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg overflow-hidden grid lg:grid-cols-2">

        {/* Left Side */}
        <div className="bg-gray-50 p-12 flex flex-col justify-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome Back!
            </h1>

            <p className="text-gray-500 mt-4 text-lg">
              Login to manage orders, meals and grow your business.
            </p>
          </div>

          <div className="mt-12 space-y-8">

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <ShieldCheck
                  size={22}
                  className="text-[#E23747]"
                />
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  Secure Access
                </h3>

                <p className="text-gray-500">
                  Your data is safe and protected.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <Clock3
                  size={22}
                  className="text-[#E23747]"
                />
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  Easy Management
                </h3>

                <p className="text-gray-500">
                  Manage vendors, meals and orders easily.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side */}
        <div className="p-12 flex flex-col justify-center">

          <h2 className="text-4xl font-bold text-center mb-3">
            Login
          </h2>

          <p className="text-center text-gray-500 mb-8">
            Enter your credentials to continue
          </p>

          <RoleSelector
            role={role}
            setRole={setRole}
          />

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder={`Enter ${role} email`}
                  className="w-full h-14 border border-gray-300 rounded-xl pl-12 pr-4 outline-none focus:border-[#E23747]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter password"
                  className="w-full h-14 border border-gray-300 rounded-xl pl-12 pr-4 outline-none focus:border-[#E23747]"
                />
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-[#E23747]"
                />
                Remember me
              </label>

              <button
                type="button"
                className="text-[#E23747] font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full h-14 bg-[#E23747] hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200"
            >
              Login
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}