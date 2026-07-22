import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// ArrowLeft icon add kiya navigation button ke liye
import { Mail, Lock, ShieldCheck, Clock3, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { login } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();

  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Password visibility track karne ke liye state
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const payload = {
        email,
        password,
      };

      const res = await login(payload);

      if (!res || !res.user) {
        throw new Error("Invalid server response.");
      }

      setUser(res.user);

      if (res.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (res.user.role === "vendor") {
        navigate("/vendor/dashboard");
      } else if (res.user.role === "user" || res.user.role === "customer") {
        navigate("/");
      } else {
        setError("Unauthorized role type.");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 relative">
      
      {/* 1. Global Floating Top-Left Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-[#E23747] font-medium transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Link>

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg overflow-hidden grid lg:grid-cols-2 mt-8 lg:mt-0">
        {/* Left Side */}
        <div className="bg-gray-50 p-12 flex flex-col justify-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Welcome Back!</h1>

            <p className="text-gray-500 mt-4 text-lg">
              Login to manage orders, meals and grow your business.
            </p>
          </div>

          <div className="mt-12 space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <ShieldCheck size={22} className="text-[#E23747]" />
              </div>

              <div>
                <h3 className="font-semibold text-lg">Secure Access</h3>

                <p className="text-gray-500">
                  Your data is safe and protected.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <Clock3 size={22} className="text-[#E23747]" />
              </div>

              <div>
                <h3 className="font-semibold text-lg">Easy Management</h3>

                <p className="text-gray-500">
                  Manage vendors, meals and orders easily.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-center mb-3">Login</h2>

          <p className="text-center text-gray-500 mb-8">
            Enter your credentials to continue
          </p>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full h-14 border border-gray-300 rounded-xl pl-12 pr-4 outline-none focus:border-[#E23747]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-14 border border-gray-300 rounded-xl pl-12 pr-12 outline-none focus:border-[#E23747]"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <Link to="/forgot-password" className="text-[#E23747] font-medium hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="h-14 w-full font-semibold">
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* 2. Alternative In-Form Bottom Link */}
          <div className="mt-6 text-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-800 transition-colors inline-flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}