// Advanced AI Logic for Fertilizer Recommendation
const fertilizers = {
  'Urea': {
    name: 'Urea',
    type: 'Nitrogenous',
    n: 46,
    p: 0,
    k: 0,
    applicationRate: '100-120 kg/ha',
    benefits: ['Promotes leafy growth', 'Increases protein content', 'Quick nitrogen release']
  },
  'DAP': {
    name: 'DAP (Diammonium Phosphate)',
    type: 'Phosphatic',
    n: 18,
    p: 46,
    k: 0,
    applicationRate: '50-60 kg/ha',
    benefits: ['Strong root development', 'Early crop maturity', 'Improves flowering']
  },
  'MOP': {
    name: 'MOP (Muriate of Potash)',
    type: 'Potassic',
    n: 0,
    p: 0,
    k: 60,
    applicationRate: '40-50 kg/ha',
    benefits: ['Disease resistance', 'Drought tolerance', 'Improves fruit quality']
  }
};

const calculateNPKRatio = (n, p, k) => {
  const total = n + p + k;
  if (total === 0) return { n: 0, p: 0, k: 0 };
  return {
    n: (n / total) * 100,
    p: (p / total) * 100,
    k: (k / total) * 100
  };
};

const getFertilizerRecommendation = (soilData) => {
  const { nitrogen, phosphorus, potassium, cropType, soilType, phLevel } = soilData;
  
  // Calculate ideal NPK based on crop
  const cropRequirements = {
    'Rice': { n: 120, p: 60, k: 60 },
    'Wheat': { n: 140, p: 70, k: 70 },
    'Maize': { n: 150, p: 75, k: 75 },
    'Cotton': { n: 100, p: 50, k: 50 },
    'Sugarcane': { n: 200, p: 100, k: 100 },
    'Potato': { n: 120, p: 60, k: 120 },
    'Tomato': { n: 100, p: 50, k: 100 }
  };
  
  const req = cropRequirements[cropType] || { n: 100, p: 50, k: 50 };
  
  // Calculate deficiency
  const nDeficit = Math.max(0, req.n - nitrogen);
  const pDeficit = Math.max(0, req.p - phosphorus);
  const kDeficit = Math.max(0, req.k - potassium);
  
  let recommendation = {};
  let confidence = 85;
  let explanation = '';
  
  // Determine primary deficiency
  if (nDeficit > pDeficit && nDeficit > kDeficit) {
    recommendation = fertilizers.Urea;
    explanation = `Your soil shows significant nitrogen deficiency (${nDeficit} ppm deficit). Urea will help boost vegetative growth for your ${cropType} crop.`;
    confidence = 88;
  } else if (pDeficit > nDeficit && pDeficit > kDeficit) {
    recommendation = fertilizers.DAP;
    explanation = `Phosphorus deficiency detected (${pDeficit} ppm deficit). DAP will promote strong root development and early crop establishment.`;
    confidence = 87;
  } else if (kDeficit > nDeficit && kDeficit > pDeficit) {
    recommendation = fertilizers.MOP;
    explanation = `Potassium deficiency detected (${kDeficit} ppm deficit). MOP will improve disease resistance and crop quality.`;
    confidence = 86;
  } else {
    recommendation = fertilizers.DAP;
    explanation = `Your soil has balanced nutrient levels. A maintenance dose of DAP will support healthy crop growth.`;
    confidence = 75;
  }
  
  // Adjust for soil type
  if (soilType === 'Sandy') {
    explanation += ' Sandy soil requires split application for better nutrient retention.';
    confidence -= 5;
  } else if (soilType === 'Clayey') {
    explanation += ' Clayey soil has good nutrient holding capacity. Apply in single dose.';
    confidence += 3;
  }
  
  // Adjust for pH
  if (phLevel < 6.0) {
    explanation += ' Low pH detected. Consider liming for better nutrient availability.';
    confidence -= 4;
  } else if (phLevel > 8.0) {
    explanation += ' High pH detected. Add organic matter to improve nutrient uptake.';
    confidence -= 4;
  }
  
  return {
    fertilizer: recommendation,
    confidence: Math.min(98, confidence),
    explanation,
    applicationRate: recommendation.applicationRate,
    deficits: { n: nDeficit, p: pDeficit, k: kDeficit }
  };
};

module.exports = { getFertilizerRecommendation, calculateNPKRatio };