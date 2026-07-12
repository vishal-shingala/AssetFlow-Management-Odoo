import { Link } from 'react-router-dom';
import { Box } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '../../../constants';
import SignupForm from '../components/SignupForm';

export default function Signup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">
      {/* Left panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar-bg relative overflow-hidden items-center justify-center p-12">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-3/4 max-w-xs aspect-square bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-full max-w-md aspect-square bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-sm aspect-square bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-md">
          <div className="fadeinup animation-duration-500">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/30">
              <Box className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Join {APP_NAME}</h1>
            <p className="text-lg text-gray-400 mb-8">{APP_TAGLINE}</p>

            <div className="grid grid-cols-2 gap-4 text-left">
              {[
                { value: '1,440+', label: 'Assets Tracked' },
                { value: '200+', label: 'Active Users' },
                { value: '99.9%', label: 'Uptime' },
                { value: '24/7', label: 'Support' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="fadeinup animation-duration-500 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                  style={{ animationDelay: `${300 + i * 100}ms` }}
                >
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md fadeinright animation-duration-500">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Box className="w-7 h-7 text-white" />
            </div>
            <span className="text-xl font-bold text-text">{APP_NAME}</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-text">Create an account</h2>
            <p className="text-muted mt-2">Get started with AssetFlow today</p>
          </div>

          <SignupForm />

          <p className="text-center text-sm text-muted mt-8">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
          </p>
          <p className="text-center text-xs text-muted mt-4">
            © 2026 {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
