
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ShieldCheck, Clock3 } from "lucide-react";
import RoleSelector from "../components/RoleSelector";
import { login } from "../service/auth.service";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        role,
      };

      console.log(payload);

      
      const res = await login(payload);

      if (res.user.role === "admin") {
        navigate("/admin/dashboard");
      }

      if (res.user.role === "vendor") {
        navigate("/vendor/dashboard");
      }
      

    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Invalid Email or Password"
      );
    } finally {
      setLoading(false);
    }
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

          <p className="text-center text-gray-500 mb-4">
            Enter your credentials to continue
          </p>

          <p className="text-center text-sm text-gray-500 mb-8">
            Logging in as{" "}
            <span className="font-semibold text-[#E23747] capitalize">
              {role}
            </span>
          </p>

          <RoleSelector
            role={role}
            setRole={setRole}
          />

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#E23747] hover:bg-red-700 disabled:bg-red-300 text-white rounded-xl font-semibold transition-all duration-200"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

