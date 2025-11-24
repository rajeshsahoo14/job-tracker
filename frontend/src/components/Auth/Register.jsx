import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'applicant'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );

    if (result.success) {
      navigate('/dashboard');
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
            <p className="text-gray-300 text-base sm:text-lg">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Messages */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-200 text-sm px-4 py-3 rounded-xl shadow-lg animate-shake">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>Please fix the errors below.</span>
                </div>
              </div>
            )}

            {/* Name Field */}
            <div className="group">
              <label className="text-gray-300 text-sm sm:text-base block mb-2 flex items-center font-medium group-hover:text-white transition-colors duration-200">
                <span className="mr-2 text-lg sm:text-xl">👤</span> 
                <span>Full Name</span>
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-white/5 backdrop-blur-sm border ${
                    errors.name ? 'border-red-500/50' : 'border-white/10'
                  } text-white placeholder-gray-500 focus:bg-white/10 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all duration-300 shadow-lg hover:shadow-xl hover:border-white/20`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-focus-within:from-indigo-500/10 group-focus-within:via-purple-500/10 group-focus-within:to-pink-500/10 pointer-events-none transition-all duration-500"></div>
              </div>
            </div>

            {/* Email Field */}
            <div className="group">
              <label className="text-gray-300 text-sm sm:text-base block mb-2 flex items-center font-medium group-hover:text-white transition-colors duration-200">
                <span className="mr-2 text-lg sm:text-xl">📧</span> 
                <span>Email address</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-white/5 backdrop-blur-sm border ${
                    errors.email ? 'border-red-500/50' : 'border-white/10'
                  } text-white placeholder-gray-500 focus:bg-white/10 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all duration-300 shadow-lg hover:shadow-xl hover:border-white/20`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-focus-within:from-indigo-500/10 group-focus-within:via-purple-500/10 group-focus-within:to-pink-500/10 pointer-events-none transition-all duration-500"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="text-gray-300 text-sm sm:text-base block mb-2 flex items-center font-medium group-hover:text-white transition-colors duration-200">
                <span className="mr-2 text-lg sm:text-xl">🔒</span> 
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-white/5 backdrop-blur-sm border ${
                    errors.password ? 'border-red-500/50' : 'border-white/10'
                  } text-white placeholder-gray-500 focus:bg-white/10 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all duration-300 shadow-lg hover:shadow-xl hover:border-white/20`}
                  placeholder="Create a password"
                />
                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-focus-within:from-indigo-500/10 group-focus-within:via-purple-500/10 group-focus-within:to-pink-500/10 pointer-events-none transition-all duration-500"></div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="group">
              <label className="text-gray-300 text-sm sm:text-base block mb-2 flex items-center font-medium group-hover:text-white transition-colors duration-200">
                <span className="mr-2 text-lg sm:text-xl">🔐</span> 
                <span>Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-white/5 backdrop-blur-sm border ${
                    errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'
                  } text-white placeholder-gray-500 focus:bg-white/10 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all duration-300 shadow-lg hover:shadow-xl hover:border-white/20`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-focus-within:from-indigo-500/10 group-focus-within:via-purple-500/10 group-focus-within:to-pink-500/10 pointer-events-none transition-all duration-500"></div>
              </div>
            </div>

            {/* Role Field */}
            <div className="group">
              <label className="text-gray-300 text-sm sm:text-base block mb-2 flex items-center font-medium group-hover:text-white transition-colors duration-200">
                <span className="mr-2 text-lg sm:text-xl">👔</span> 
                <span>Account Type</span>
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white focus:bg-white/10 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all duration-300 shadow-lg hover:shadow-xl hover:border-white/20 appearance-none"
                >
                  <option value="applicant" className="bg-slate-900">Applicant</option>
                  <option value="admin" className="bg-slate-900">Admin</option>
                </select>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-focus-within:from-indigo-500/10 group-focus-within:via-purple-500/10 group-focus-within:to-pink-500/10 pointer-events-none transition-all duration-500"></div>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8"> {/* Added mt-8 for spacing above the sign-up button */}
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
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <span>Sign up ✨</span>
                  )}
                </span>
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100"></div>
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center text-gray-400 text-sm sm:text-base mt-6">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text hover:from-indigo-300 hover:to-purple-300 font-semibold transition-all duration-200 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;