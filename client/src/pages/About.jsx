import React from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaLeaf, FaHandHoldingHeart, FaChartLine, FaUsers, FaGlobe } from 'react-icons/fa';

const About = () => {
  const values = [
    {
      icon: FaBrain,
      title: 'Innovation',
      description: 'Leveraging cutting-edge AI technology to solve real-world agricultural challenges.'
    },
    {
      icon: FaLeaf,
      title: 'Sustainability',
      description: 'Promoting eco-friendly farming practices for a better tomorrow.'
    },
    {
      icon: FaHandHoldingHeart,
      title: 'Farmer First',
      description: 'Putting farmers\' needs at the center of everything we do.'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Farmers', icon: FaUsers },
    { number: '98%', label: 'Satisfaction Rate', icon: FaChartLine },
    { number: '25+', label: 'Countries Served', icon: FaGlobe }
  ];

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            About AgriAI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We're on a mission to transform agriculture through artificial intelligence, 
            making precision farming accessible to every farmer worldwide.
          </p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              At AgriAI, we believe that technology should empower farmers, not replace them. 
              Our mission is to democratize access to precision agriculture tools through 
              intelligent, easy-to-use AI systems.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              By combining soil science, crop biology, and machine learning, we help farmers 
              make data-driven decisions that increase yields, reduce costs, and protect 
              the environment.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl p-8"
          >
            <div className="text-center">
              <FaLeaf className="text-6xl text-primary-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Smart Farming</h3>
              <p className="text-gray-600 dark:text-gray-400">For a Sustainable Future</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white dark:bg-gray-900 py-20 mb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600 dark:text-gray-400">What drives us every day</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg"
              >
                <value.icon className="text-4xl text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
            >
              <stat.icon className="text-4xl mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;