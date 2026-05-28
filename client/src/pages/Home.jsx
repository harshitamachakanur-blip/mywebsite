import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRobot, FaChartLine, FaShieldAlt, FaTractor } from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: FaRobot,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze multiple soil parameters for precise recommendations.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaChartLine,
      title: 'Real-time Insights',
      description: 'Get instant fertilizer recommendations based on current soil conditions and weather data.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FaShieldAlt,
      title: 'Sustainable Farming',
      description: 'Optimize fertilizer usage while protecting the environment and improving crop yield.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: FaTractor,
      title: 'Crop Specific',
      description: 'Personalized recommendations for different crop types and growing conditions.',
      color: 'from-purple-500 to-pink-500'
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent">
              Smart Fertilizer
              <br />
              Recommendations with AI
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Revolutionize your farming with our advanced AI system that provides precise fertilizer recommendations based on soil analysis, weather conditions, and crop requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/ai-recommendation" className="btn-primary inline-block">
                Get AI Recommendation
              </Link>
              <Link to="/about" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all border border-gray-300 dark:border-gray-700">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose AgriAI?</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Cutting-edge technology for modern agriculture</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-hover bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-xl"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '10K+', label: 'Farmers Served' },
              { number: '95%', label: 'Accuracy Rate' },
              { number: '30%', label: 'Yield Increase' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Optimize Your Farming?</h2>
            <p className="text-xl text-white/90 mb-8">Get started with our AI-powered fertilizer recommendation system today!</p>
            <Link to="/auth" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105 inline-block">
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;