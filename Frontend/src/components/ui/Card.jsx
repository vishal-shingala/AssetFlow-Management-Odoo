import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, padding = 'p-6' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -2, boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.08)' } : {}}
      transition={{ duration: 0.2 }}
      className={`bg-surface rounded-xl border border-gray-100 shadow-sm ${padding} ${className}`}
    >
      {children}
    </motion.div>
  );
}
