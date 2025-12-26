import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Shield,
  Check,
  AlertCircle,
  Key,
  Crown,
} from "lucide-react";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    adminSecret: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminSecret: "",
  });

  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAdminSecret, setShowAdminSecret] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      adminSecret: "",
    };
    let isValid = true;

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password =
        "Password must include uppercase, lowercase, and numbers";
      isValid = false;
    }

    // Confirm password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Admin secret validation
    if (form.role === "admin" && !form.adminSecret.trim()) {
      newErrors.adminSecret = "Admin secret key is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (value: string) => {
    setForm((prev) => ({ ...prev, password: value }));
    checkPasswordStrength(value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
    if (msg) setMsg("");
  };

  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (msg) setMsg("");
  };

  const handleRoleChange = (role: string) => {
    setForm((prev) => ({ ...prev, role, adminSecret: "" }));
    setErrors((prev) => ({ ...prev, adminSecret: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          adminSecret: form.role === "admin" ? form.adminSecret : undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (form.role === "admin") {
          setMsg(
            "Admin account created successfully! Redirecting to admin login..."
          );
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setMsg("Account created successfully! Redirecting to login...");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } else {
        setMsg(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setMsg("Network error. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    if (passwordStrength >= 4) return "bg-green-500";
    return "bg-gray-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength === 3) return "Good";
    if (passwordStrength >= 4) return "Strong";
    return "Very Weak";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#191919] via-[#0f0f0f] to-[#191919] flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#1B42CB]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FF2F6C]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-linear-to-r from-[#1B42CB]/5 to-[#FF2F6C]/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Signup Card */}
      <div className="relative w-full max-w-md">
        {/* Decorative Elements */}
        <div className="absolute -top-6 -left-6 w-16 h-16 backdrop-blur-xl bg-[#1B42CB]/20 border border-[#1B42CB]/30 rounded-2xl flex items-center justify-center animate-float">
          <User className="w-8 h-8 text-[#1B42CB]" />
        </div>
        <div className="absolute -bottom-6 -right-6 w-14 h-14 backdrop-blur-xl bg-[#FF2F6C]/20 border border-[#FF2F6C]/30 rounded-2xl flex items-center justify-center animate-float delay-500">
          <Shield className="w-7 h-7 text-[#FF2F6C]" />
        </div>

        {/* Main Card */}
        <div className="backdrop-blur-xl bg-[#191919]/70 border border-[#1B42CB]/30 rounded-3xl p-8 shadow-2xl shadow-[#1B42CB]/10">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#1B42CB] to-[#FF2F6C] flex items-center justify-center mx-auto hover:scale-105 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold bg-linear-to-r from-[#EEECF6] to-[#FF2F6C] bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-[#EEECF6]/60">
              Join SmartPark as{" "}
              {form.role === "admin" ? "Administrator" : "User"}
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#EEECF6] mb-3">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange("user")}
                className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                  form.role === "user"
                    ? "bg-linear-to-br from-[#1B42CB]/20 to-[#1B42CB]/10 border-[#1B42CB] text-[#EEECF6]"
                    : "bg-[#191919]/50 border-[#1B42CB]/30 text-[#EEECF6]/60 hover:border-[#1B42CB] hover:text-[#EEECF6]"
                }`}
              >
                <User className="w-6 h-6" />
                <span className="font-medium">User</span>
                <span className="text-xs opacity-70">Regular Account</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("admin")}
                className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                  form.role === "admin"
                    ? "bg-linear-to-br from-[#FF2F6C]/20 to-[#FF2F6C]/10 border-[#FF2F6C] text-[#EEECF6]"
                    : "bg-[#191919]/50 border-[#FF2F6C]/30 text-[#EEECF6]/60 hover:border-[#FF2F6C] hover:text-[#EEECF6]"
                }`}
              >
                <Crown className="w-6 h-6" />
                <span className="font-medium">Admin</span>
                <span className="text-xs opacity-70">Administrator</span>
              </button>
            </div>
          </div>

          {/* Success Message */}
          {msg && msg.includes("successfully") ? (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <div className="flex items-center gap-2 text-green-400">
                <Check className="w-5 h-5" />
                <span className="font-medium">{msg}</span>
              </div>
            </div>
          ) : msg ? (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{msg}</span>
              </div>
            </div>
          ) : null}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-[#EEECF6] mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <User className="w-5 h-5 text-[#1B42CB]" />
                </div>
                <input
                  type="text"
                  required
                  className={`w-full pl-12 pr-4 py-3 bg-[#191919]/50 border ${
                    errors.name ? "border-red-500/50" : "border-[#1B42CB]/30"
                  } rounded-xl text-[#EEECF6] placeholder-[#EEECF6]/40 focus:outline-none focus:border-[#1B42CB] focus:ring-2 focus:ring-[#1B42CB]/20 transition-all duration-300`}
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

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
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-[#EEECF6] mb-2">
                Password
              </label>
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
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
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

              {/* Password Strength Meter */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#EEECF6]/60">
                      Password strength:
                    </span>
                    <span
                      className={`font-medium ${
                        passwordStrength <= 2
                          ? "text-red-400"
                          : passwordStrength === 3
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="h-2 bg-[#191919] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-[#EEECF6] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Lock className="w-5 h-5 text-[#1B42CB]" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className={`w-full pl-12 pr-12 py-3 bg-[#191919]/50 border ${
                    errors.confirmPassword
                      ? "border-red-500/50"
                      : "border-[#1B42CB]/30"
                  } rounded-xl text-[#EEECF6] placeholder-[#EEECF6]/40 focus:outline-none focus:border-[#1B42CB] focus:ring-2 focus:ring-[#1B42CB]/20 transition-all duration-300`}
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#EEECF6]/60 hover:text-[#EEECF6] transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Admin Secret Field */}
            {form.role === "admin" && (
              <div>
                <label className="block text-sm font-medium text-[#EEECF6] mb-2">
                  Admin Secret Key
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Key className="w-5 h-5 text-[#FF2F6C]" />
                  </div>
                  <input
                    type={showAdminSecret ? "text" : "password"}
                    required={form.role === "admin"}
                    className={`w-full pl-12 pr-12 py-3 bg-[#191919]/50 border ${
                      errors.adminSecret
                        ? "border-red-500/50"
                        : "border-[#FF2F6C]/30"
                    } rounded-xl text-[#EEECF6] placeholder-[#EEECF6]/40 focus:outline-none focus:border-[#FF2F6C] focus:ring-2 focus:ring-[#FF2F6C]/20 transition-all duration-300`}
                    placeholder="Enter admin secret key"
                    value={form.adminSecret}
                    onChange={(e) =>
                      handleInputChange("adminSecret", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminSecret(!showAdminSecret)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#EEECF6]/60 hover:text-[#FF2F6C] transition-colors"
                  >
                    {showAdminSecret ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.adminSecret && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.adminSecret}
                  </p>
                )}
                <div className="mt-2 text-xs text-[#FF2F6C]/60">
                  Contact system administrator for the secret key
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 mt-1 rounded bg-[#191919]/50 border border-[#1B42CB]/30 text-[#1B42CB] focus:ring-[#1B42CB]/20 focus:ring-2"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-[#EEECF6]/70">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-[#1B42CB] hover:text-[#FF2F6C] transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-[#1B42CB] hover:text-[#FF2F6C] transition-colors"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                form.role === "admin"
                  ? "bg-linear-to-r from-[#FF2F6C] to-red-600 hover:shadow-[#FF2F6C]/20"
                  : "bg-linear-to-r from-[#1B42CB] to-[#FF2F6C] hover:shadow-[#FF2F6C]/20"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating {form.role === "admin" ? "Admin" : ""} Account...
                </>
              ) : (
                <>
                  {form.role === "admin" ? (
                    <>
                      <Crown className="w-5 h-5" />
                      Create Admin Account
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Create User Account
                    </>
                  )}
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
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Links */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/login"
                className="px-4 py-3 bg-[#191919]/50 border border-[#1B42CB]/30 text-[#EEECF6] font-medium rounded-xl hover:bg-[#1B42CB]/10 transition-all duration-300 text-center"
              >
                User Login
              </Link>
              <Link
                to="/admin-login"
                className="px-4 py-3 bg-[#191919]/50 border border-[#FF2F6C]/30 text-[#EEECF6] font-medium rounded-xl hover:bg-[#FF2F6C]/10 transition-all duration-300 text-center"
              >
                Admin Login
              </Link>
            </div>
          </form>
        </div>

        {/* Account Type Benefits */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className={`p-4 rounded-xl border transition-all duration-300 ${
              form.role === "user"
                ? "bg-linear-to-br from-[#1B42CB]/10 to-transparent border-[#1B42CB]/30"
                : "bg-[#191919]/30 border-[#1B42CB]/20"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#1B42CB]/10 flex items-center justify-center">
                <User className="w-4 h-4 text-[#1B42CB]" />
              </div>
              <span className="font-medium text-[#EEECF6]">User Account</span>
            </div>
            <ul className="space-y-1 text-sm text-[#EEECF6]/60">
              <li>• Book parking slots</li>
              <li>• View booking history</li>
              <li>• Get parking recommendations</li>
            </ul>
          </div>
          <div
            className={`p-4 rounded-xl border transition-all duration-300 ${
              form.role === "admin"
                ? "bg-linear-to-br from-[#FF2F6C]/10 to-transparent border-[#FF2F6C]/30"
                : "bg-[#191919]/30 border-[#FF2F6C]/20"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF2F6C]/10 flex items-center justify-center">
                <Crown className="w-4 h-4 text-[#FF2F6C]" />
              </div>
              <span className="font-medium text-[#EEECF6]">Admin Account</span>
            </div>
            <ul className="space-y-1 text-sm text-[#EEECF6]/60">
              <li>• Manage parking slots</li>
              <li>• View all users</li>
              <li>• Access analytics</li>
            </ul>
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
