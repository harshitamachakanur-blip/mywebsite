export const SOIL_TYPES = [
  'Loamy', 'Sandy', 'Clayey', 'Peaty', 'Saline', 'Chalky'
];

export const CROP_TYPES = [
  'Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 
  'Potato', 'Tomato', 'Onion', 'Soybean', 'Barley'
];

export const FERTILIZERS = {
  'Urea': { n: 46, p: 0, k: 0, description: 'High nitrogen fertilizer for leafy growth' },
  'DAP': { n: 18, p: 46, k: 0, description: 'Rich in phosphorus for root development' },
  'MOP': { n: 0, p: 0, k: 60, description: 'Potassium-rich for disease resistance' },
  'NPK 20:20:20': { n: 20, p: 20, k: 20, description: 'Balanced fertilizer for overall growth' },
  'NPK 10:26:26': { n: 10, p: 26, k: 26, description: 'High P&K for flowering and fruiting' },
  'Compost': { n: 1, p: 1, k: 1, description: 'Organic fertilizer for soil health' },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  RECOMMENDATIONS: {
    GENERATE: '/recommendations/generate',
    GET_USER: '/recommendations/user',
    GET_ALL: '/recommendations',
  },
};