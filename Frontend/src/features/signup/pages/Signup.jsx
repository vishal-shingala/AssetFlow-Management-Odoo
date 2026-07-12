import { motion } from 'framer-motion';
import { HiOutlineCube } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { APP_NAME, APP_TAGLINE } from '../../../constants';
import SignupForm from '../components/SignupForm';

export default function Signup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">
      {/* Left panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden items-center justify-center p-12">
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
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/30">
              <HiOutlineCube className="w-10 h-10 text-white" />
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
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                >
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right panel - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <HiOutlineCube className="w-6 h-6 text-white" />
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
        </motion.div>
      </div>
    </div>
  );
}
