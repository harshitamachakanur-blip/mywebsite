import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaTwitter, FaFacebook, FaLinkedin, FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaLeaf className="text-primary-500 text-2xl" />
              <span className="text-xl font-bold">AgriAI</span>
            </div>
            <p className="text-gray-400">
              Revolutionizing agriculture with AI-powered fertilizer recommendations for sustainable farming.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-primary-500 transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-primary-500 transition-colors">About</Link></li>
              <li><Link to="/ai-recommendation" className="text-gray-400 hover:text-primary-500 transition-colors">AI Recommendation</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">API Reference</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <motion.a whileHover={{ y: -3 }} href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <FaTwitter />
              </motion.a>
              <motion.a whileHover={{ y: -3 }} href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <FaFacebook />
              </motion.a>
              <motion.a whileHover={{ y: -3 }} href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <FaLinkedin />
              </motion.a>
              <motion.a whileHover={{ y: -3 }} href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <FaGithub />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} AgriAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;