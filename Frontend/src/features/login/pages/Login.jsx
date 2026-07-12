import { Link } from 'react-router-dom';
import { Box, CheckCircle2 } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '../../../constants';
import LoginForm from '../components/LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen bg-background-DEFAULT flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar-bg relative overflow-hidden flex-col justify-between p-12">
        {/* Subtle background pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 max-w-xs aspect-square bg-primary/10 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-3/4 max-w-sm aspect-square bg-primary/5 rounded-full translate-y-1/3 -translate-x-1/3" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="min-w-10 min-h-10 max-w-15 max-h-15 bg-primary rounded-xl flex items-center justify-center shadow-glow-primary">
            <Box className="w-7 h-7 text-white" />
          </div>
          <span className="text-xl font-bold text-white">{APP_NAME}</span>
        </div>

        <div className="relative z-10 max-w-sm">
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Smart Asset Management for Modern Teams
          </h1>
          <p className="text-slate-400 mb-10 text-base leading-relaxed">{APP_TAGLINE}</p>

          <div className="space-y-3.5">
            {[
              'Real-time asset tracking and monitoring',
              'Automated maintenance scheduling',
              'Comprehensive lifecycle reporting',
              'Multi-department allocation control',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className=" min-w-10 max-w-10 min-h-10 max-h-10 rounded-full bg-primary/20 flex items-center justify-center flex-none">
                  <CheckCircle2 className="w-5 h-5 text-primary-light" />
                </div>
                <span className="text-sm text-slate-300">{feature}</span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { value: '1,440+', label: 'Assets' },
              { value: '200+', label: 'Users' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-4 text-center">
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © 2026 {APP_NAME}. All rights reserved.
        </div>
      </div>

      {/* Right panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background-surface">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Box className="w-7 h-7 text-white" />
            </div>
            <span className="text-xl font-bold text-text">{APP_NAME}</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text">Welcome back 👋</h2>
            <p className="text-muted text-sm mt-2">Sign in to your account to continue</p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-muted mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:text-primary-dark transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
