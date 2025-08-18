import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#06404c] to-[#0a5a6a] flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          className="w-32 h-32 mx-auto mb-8 bg-[#bcdc49] rounded-full flex items-center justify-center shadow-lg"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="text-6xl font-bold text-[#06404c]">D</div>
        </motion.div>
        <motion.h1 
          className="text-5xl font-bold text-white mb-3 tracking-wide"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          DRIVA
        </motion.h1>
        <motion.p 
          className="text-[#bcdc49] text-xl tracking-wider"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Driving Innovation Forward
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SplashScreen;