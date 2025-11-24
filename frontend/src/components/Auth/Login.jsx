import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) navigate("/dashboard");
      else setError(result.message || "Login failed. Try again.");
    } catch {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>

      <div className="relative max-w-md w-full">
        {/* Glow Effect Behind Card */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-20 transform scale-105"></div>
        
        <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 sm:p-10 lg:p-12 shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
          {/* Logo + Title */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="relative mx-auto h-20 w-20 sm:h-24 sm:w-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-2xl shadow-lg transform rotate-6 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl shadow-2xl flex items-center justify-center">
                <span className="text-4xl sm:text-5xl">📋</span>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent drop-shadow-lg mb-3">
              Job Tracker
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">Welcome back! Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-200 text-sm px-4 py-3 rounded-xl shadow-lg animate-shake">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="group">
              <label className="text-gray-300 text-sm sm:text-base block mb-2 flex items-center font-medium group-hover:text-white transition-colors duration-200">
                <span className="mr-2 text-lg sm:text-xl">📧</span> 
                <span>Email address</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 focus:bg-white/10 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all duration-300 shadow-lg hover:shadow-xl hover:border-white/20"
                  placeholder="you@example.com"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-focus-within:from-indigo-500/10 group-focus-within:via-purple-500/10 group-focus-within:to-pink-500/10 pointer-events-none transition-all duration-500"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="group mb-8"> {/* Added mb-8 for proper spacing after password field */}
              <label className="text-gray-300 text-sm sm:text-base block mb-2 flex items-center font-medium group-hover:text-white transition-colors duration-200">
                <span className="mr-2 text-lg sm:text-xl">🔒</span> 
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 pr-12 sm:pr-14 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 focus:bg-white/10 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all duration-300 shadow-lg hover:shadow-xl hover:border-white/20"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-200 text-lg sm:text-xl hover:scale-125 focus:outline-none"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-focus-within:from-indigo-500/10 group-focus-within:via-purple-500/10 group-focus-within:to-pink-500/10 pointer-events-none transition-all duration-500"></div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 font-semibold text-base sm:text-lg rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white hover:from-indigo-600 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-[1.02] active:scale-95 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign in ✨</span>
                )}
              </span>
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100"></div>
            </button>

            {/* Register Link */}
            <p className="text-center text-gray-400 text-sm sm:text-base mt-6">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text hover:from-indigo-300 hover:to-purple-300 font-semibold transition-all duration-200 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>

          {/* Demo Credentials */}
          <details className="mt-8 group/details">
            <summary className="cursor-pointer text-gray-300 hover:text-white text-sm sm:text-base text-center py-3 font-medium transition-all duration-200 list-none flex items-center justify-center gap-2 rounded-lg hover:bg-white/5">
              <span>🎭 Demo Credentials</span>
              <svg className="w-4 h-4 transform transition-transform duration-200 group-open/details:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="mt-4 space-y-3 text-sm sm:text-base animate-fadeIn">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-lg hover:shadow-xl hover:bg-white/10 transition-all duration-200 transform hover:scale-[1.02]">
                <div className="flex items-start gap-3">
                  <span className="text-xl sm:text-2xl">👤</span>
                  <div className="flex-1 min-w-0">
                    <strong className="text-gray-200 block mb-1">Applicant</strong>
                    <code className="text-xs sm:text-sm text-indigo-300 block break-all">applicant@demo.com</code>
                    <code className="text-xs sm:text-sm text-purple-300 block">password123</code>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-lg hover:shadow-xl hover:bg-white/10 transition-all duration-200 transform hover:scale-[1.02]">
                <div className="flex items-start gap-3">
                  <span className="text-xl sm:text-2xl">👨‍💼</span>
                  <div className="flex-1 min-w-0">
                    <strong className="text-gray-200 block mb-1">Admin</strong>
                    <code className="text-xs sm:text-sm text-indigo-300 block break-all">admin@demo.com</code>
                    <code className="text-xs sm:text-sm text-purple-300 block">password123</code>
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default Login;
