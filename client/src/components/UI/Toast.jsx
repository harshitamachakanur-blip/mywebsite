import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaErrorCircle, FaInfoCircle, FaWarning } from 'react-icons/fa';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <FaCheckCircle className="text-green-500" />,
    error: <FaErrorCircle className="text-red-500" />,
    warning: <FaWarning className="text-yellow-500" />,
    info: <FaInfoCircle className="text-blue-500" />
  };

  const bgColors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-500',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-500',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-l-4 ${bgColors[type]} bg-white dark:bg-gray-800 min-w-[300px] max-w-md`}
      >
        {icons[type]}
        <p className="text-gray-700 dark:text-gray-300 flex-1">{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;