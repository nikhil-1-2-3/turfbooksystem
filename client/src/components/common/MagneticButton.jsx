import React from 'react';
import { motion } from 'framer-motion';

const MagneticButton = ({ children, className = "", onClick, ...props }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden group ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
      <motion.div
        className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      />
    </motion.button>
  );
};

export default MagneticButton;
