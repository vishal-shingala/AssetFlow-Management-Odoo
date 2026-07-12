import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

import toast from 'react-hot-toast';
import { APP_NAME, APP_TAGLINE } from '../constants';

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success('Account created successfully! Welcome to ' + APP_NAME);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col-reverse lg:flex-row">
      
      {/* Left panel - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <i className="pi pi-box w-6 h-6 text-white"></i>
            </div>
            <span className="text-xl font-bold text-text">{APP_NAME}</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-text">Create an account</h2>
            <p className="text-muted mt-2">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Email Address</label>
              <div className="relative">
                <i className="pi pi-envelope absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"></i>
                <input
                  type="email"
                  placeholder="you@company.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                  })}
                  className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-white
                    placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all duration-200
                    ${errors.email ? 'border-danger' : 'border-gray-300'}`}
                />
              </div>
              {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Password</label>
              <div className="relative">
                <i className="pi pi-lock absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  className={`w-full pl-10 pr-12 py-3 text-sm rounded-xl border bg-white
                    placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all duration-200
                    ${errors.password ? 'border-danger' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                >
                  {showPassword ? (
                    <i className="pi pi-eye-slash w-4 h-4"></i>
                  ) : (
                    <i className="pi pi-eye w-4 h-4"></i>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('terms', { required: 'You must accept the terms' })}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-muted">I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a></span>
              </label>
            </div>
            {errors.terms && <p className="text-xs text-danger -mt-2">{errors.terms.message}</p>}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-primary via-indigo-500 to-primary hover:from-primary-dark hover:to-indigo-600 text-white font-semibold rounded-xl
                transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed
                shadow-lg shadow-primary/30 bg-[length:200%_auto] hover:bg-right"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                'Sign Up'
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-muted mt-8">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
          </p>
          <p className="text-center text-xs text-muted mt-4">
            © 2026 {APP_NAME}. All rights reserved.
          </p>
        </motion.div>
      </div>

      {/* Right panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/30">
              <i className="pi pi-user-plus w-10 h-10 text-white flex items-center justify-center text-3xl"></i>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Join {APP_NAME}</h1>
            <p className="text-lg text-slate-400 mb-8">Unlock powerful enterprise asset management.</p>

            <div className="grid grid-cols-2 gap-4 text-left">
              {[
                { value: 'Lightning', label: 'Fast Setup' },
                { value: 'Secure', label: 'Data Encryption' },
                { value: 'Team', label: 'Collaboration' },
                { value: 'Analytics', label: 'Deep Insights' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                >
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
