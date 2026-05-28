import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    // Simulate API call — replace with real endpoint if needed
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Message sent successfully! We will reply within 24 hours. 🌱');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  const info = [
    { icon: FaEnvelope,     label: 'Email',    value: 'support@agriai.com' },
    { icon: FaPhone,        label: 'Phone',    value: '+91 98765 43210' },
    { icon: FaMapMarkerAlt, label: 'Address',  value: 'Bengaluru, Karnataka, India' },
    { icon: FaClock,        label: 'Hours',    value: 'Mon–Sat, 9 AM – 6 PM IST' },
  ];

  return (
    <div className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent mb-3">
            Contact Us
          </h1>
          <p className="text-gray-600 dark:text-gray-400">We'd love to hear from you. Send us a message!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Get In Touch</h3>
              {info.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Icon className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: 'name', label: 'Your Name', type: 'text', placeholder: 'Rakshita' },
                { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                { name: 'subject', label: 'Subject', type: 'text', placeholder: 'How can we help?' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{f.label}</label>
                  <input type={f.type} name={f.name} value={formData[f.name]} onChange={handleChange}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={4}
                  placeholder="Write your message here..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-600 transition disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? (
                  <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> Sending...</>
                ) : (
                  <><FaPaperPlane /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
