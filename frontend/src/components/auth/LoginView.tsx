import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { GraduationCap, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useSchool();
  const [email, setEmail] = useState('admin@greenwoodschool.edu');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (!success) {
        setErrorMessage('Invalid credentials. Please verify your email and password.');
      }
    } catch {
      setErrorMessage('Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@greenwoodschool.edu');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 lg:p-8">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 border border-slate-800/20">
        {/* Left Side: Educational / Administrative Hero Branding */}
        <div className="bg-gradient-to-br from-[#0B1C30] via-[#102A43] to-[#1E3A8A] text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle geometric pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight block">SchoolERP</span>
                <span className="text-xs text-blue-200">Small-School Management Platform</span>
              </div>
            </div>

            <div className="pt-8">
              <h2 className="text-2xl lg:text-3xl font-bold leading-tight tracking-tight text-white">
                Simple, reliable school administration.
              </h2>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                Centralize student records, parent communication, attendance tracking, and fee reconciliations in one streamlined dashboard.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-10 space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Single Role Architecture</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Designed specifically for School Owners and Head Administrators without unnecessary enterprise bloat.
              </p>
            </div>

            <div className="text-[11px] text-slate-400">
              Academic Year 2026–27 • Greenwood Valley Public School
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 lg:p-12 bg-white flex flex-col justify-center">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h3>
            <p className="text-xs text-slate-500 mt-1">
              Please enter your administrator credentials to access your dashboard.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@greenwoodschool.edu"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 text-slate-900 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => alert('Forgot password reset will be sent to the registered school domain in production.')}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 text-slate-900 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-600">Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Quick-Fill Helper */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-center space-y-1.5">
              <div className="text-[11px] font-semibold text-blue-800">
                Demo Administrator Credentials
              </div>
              <div className="text-xs font-mono text-slate-600">
                admin@greenwoodschool.edu / admin123
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="mt-1 text-xs text-blue-600 font-semibold hover:underline"
              >
                Auto-fill credentials
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
