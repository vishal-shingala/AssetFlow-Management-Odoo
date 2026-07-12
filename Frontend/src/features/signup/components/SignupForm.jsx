import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { signupSchema } from '../schemas/signupSchema';
import { signup } from '../api/signupApi';

export default function SignupForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data) => {
    try {
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create account. Please try again.';
      toast.error(errorMessage);
      console.error('Signup error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">Full Name</label>
        <div className="relative">
          <i className="pi pi-user absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"></i>
          <input
            type="text"
            placeholder="John Doe"
            {...register('name')}
            className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-white
              placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              transition-all duration-200
              ${errors.name ? 'border-danger' : 'border-gray-300'}`}
          />
        </div>
        {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">Email Address</label>
        <div className="relative">
          <i className="pi pi-envelope absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"></i>
          <input
            type="email"
            placeholder="you@company.com"
            {...register('email')}
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
          <i className="pi pi-lock absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"></i>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            {...register('password')}
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
              <i className="pi pi-eye-slash w-5 h-5"></i>
            ) : (
              <i className="pi pi-eye w-5 h-5"></i>
            )}
          </button>
        </div>
        {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">Confirm Password</label>
        <div className="relative">
          <i className="pi pi-lock absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"></i>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            {...register('confirmPassword')}
            className={`w-full pl-10 pr-12 py-3 text-sm rounded-xl border bg-white
              placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              transition-all duration-200
              ${errors.confirmPassword ? 'border-danger' : 'border-gray-300'}`}
          />
        </div>
        {errors.confirmPassword && <p className="text-xs text-danger mt-1">{errors.confirmPassword.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-primary hover:bg-indigo-700 active:scale-95 text-white font-semibold rounded-xl
          transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
          shadow-lg shadow-primary/25"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating Account...
          </div>
        ) : (
          'Sign Up'
        )}
      </button>
    </form>
  );
}
