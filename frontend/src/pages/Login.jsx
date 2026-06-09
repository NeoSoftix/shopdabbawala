import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { login } from "../service/auth.service";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { setUser } = useAuth();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await login(phone);


      if (!res.success) {
        setError(res.message || "Login failed");
        return;
      }

      setUser(res.user);

      if (res.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (res.user.role === "vendor") {
        navigate("/vendor");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log("Login Error", error);

      setError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 sm:p-10">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-red-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            F
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mt-6">
          <h1 className="text-4xl font-bold text-gray-900">Welcome Back</h1>

          <p className="mt-3 text-gray-500">Login to continue</p>
        </div>

        {/* Phone Input */}
        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>

          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="flex-1 px-4 py-4 outline-none"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300"
        >
          {loading ? "Logging In..." : "Login"}

          <span className="h-8 w-8 rounded-full bg-white text-red-600 flex items-center justify-center">
            <FaArrowRight size={12} />
          </span>
        </button>
      </div>
      {error && <p className="mt-3 text-center text-red-500">{error}</p>}
    </div>
  );
}
