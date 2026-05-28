import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className="text-gray-700 dark:text-gray-300 font-semibold">Analyzing soil data...</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Our AI is working its magic</p>
      </div>
    </div>
  );
};

export default Loader;