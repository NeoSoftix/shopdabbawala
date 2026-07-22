import { useState } from "react";
import { Mail, MailCheck } from "lucide-react";
import { forgotPassword } from "../services/auth.service";
import Button from "../components/ui/Button";
import BackLink from "../components/ui/BackLink";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await forgotPassword({ email });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden p-10">
        <BackLink to="/login" className="mb-6">Back to Login</BackLink>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <MailCheck size={26} className="text-[#E23747]" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Check your email</h2>
            <p className="text-gray-500">
              If an account exists for <span className="font-medium text-gray-700">{email}</span>,
              we&apos;ve sent a link to reset your password.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-3">Forgot Password?</h2>
            <p className="text-gray-500 mb-8">
              Enter your email address and we&apos;ll send you a link to reset your password.
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

              <Button type="submit" loading={loading} className="h-14 w-full font-semibold">
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
