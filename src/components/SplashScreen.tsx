import React from 'react';
import { motion } from 'framer-motion';
import Logo from "@/components/Logo";

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
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Logo size="xl" className="mx-auto mb-8" />
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