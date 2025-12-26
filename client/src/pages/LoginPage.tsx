import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Car } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMsg("");

    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization header 
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        login(data.user, data.token);
        navigate("/");
      } else {
        setMsg(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setMsg("Network error. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (msg) setMsg("");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#191919] via-[#0f0f0f] to-[#191919] flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#1B42CB]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FF2F6C]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1B42CB]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Decorative Elements */}
        <div className="absolute -top-6 -left-6 w-16 h-16 backdrop-blur-xl bg-[#1B42CB]/20 border border-[#1B42CB]/30 rounded-2xl flex items-center justify-center animate-float">
          <Car className="w-8 h-8 text-[#1B42CB]" />
        </div>
        <div className="absolute -bottom-6 -right-6 w-14 h-14 backdrop-blur-xl bg-[#FF2F6C]/20 border border-[#FF2F6C]/30 rounded-2xl flex items-center justify-center animate-float delay-500">
          <Lock className="w-7 h-7 text-[#FF2F6C]" />
        </div>

        {/* Main Card */}
        <div className="backdrop-blur-xl bg-[#191919]/70 border border-[#1B42CB]/30 rounded-3xl p-8 shadow-2xl shadow-[#1B42CB]/10">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#1B42CB] to-[#FF2F6C] flex items-center justify-center mx-auto hover:scale-105 transition-transform duration-300">
                <Car className="w-8 h-8 text-white" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold bg-linear-to-r from-[#EEECF6] to-[#1B42CB] bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-[#EEECF6]/60">
              Sign in to access your SmartPark account
            </p>
          </div>

          {/* Error Message */}
          {msg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div className="flex items-center gap-2 text-red-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">{msg}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[#EEECF6] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Mail className="w-5 h-5 text-[#1B42CB]" />
                </div>
                <input
                  type="email"
                  required
                  className={`w-full pl-12 pr-4 py-3 bg-[#191919]/50 border ${
                    errors.email ? "border-red-500/50" : "border-[#1B42CB]/30"
                  } rounded-xl text-[#EEECF6] placeholder-[#EEECF6]/40 focus:outline-none focus:border-[#1B42CB] focus:ring-2 focus:ring-[#1B42CB]/20 transition-all duration-300`}
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => validateForm()}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-[#EEECF6]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-[#1B42CB] hover:text-[#FF2F6C] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Lock className="w-5 h-5 text-[#1B42CB]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full pl-12 pr-12 py-3 bg-[#191919]/50 border ${
                    errors.password
                      ? "border-red-500/50"
                      : "border-[#1B42CB]/30"
                  } rounded-xl text-[#EEECF6] placeholder-[#EEECF6]/40 focus:outline-none focus:border-[#1B42CB] focus:ring-2 focus:ring-[#1B42CB]/20 transition-all duration-300`}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  onBlur={() => validateForm()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#EEECF6]/60 hover:text-[#EEECF6] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded bg-[#191919]/50 border border-[#1B42CB]/30 text-[#1B42CB] focus:ring-[#1B42CB]/20 focus:ring-2"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm text-[#EEECF6]/70"
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-linear-to-r from-[#1B42CB] to-[#FF2F6C] text-white font-bold rounded-xl hover:shadow-xl hover:shadow-[#FF2F6C]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1B42CB]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#191919]/70 text-[#EEECF6]/50">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 bg-[#191919]/50 border border-[#1B42CB]/20 rounded-xl text-[#EEECF6] hover:bg-[#1B42CB]/10 transition-all duration-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 bg-[#191919]/50 border border-[#1B42CB]/20 rounded-xl text-[#EEECF6] hover:bg-[#1B42CB]/10 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-[#EEECF6]/60">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-[#1B42CB] hover:text-[#FF2F6C] transition-colors"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-[#EEECF6]/40">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Your data is encrypted and secure</span>
          </div>
        </div>
      </div>

      {/* Custom Animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
