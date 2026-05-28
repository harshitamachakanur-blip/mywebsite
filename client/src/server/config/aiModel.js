// AI Model Configuration
// This is a sophisticated rule-based AI recommendation system

class AIModel {
  constructor() {
    this.fertilizerDatabase = {
      'Urea': { n: 46, p: 0, k: 0, type: 'Nitrogenous', bestFor: ['Rice', 'Wheat', 'Maize'] },
      'DAP': { n: 18, p: 46, k: 0, type: 'Phosphatic', bestFor: ['Wheat', 'Cotton', 'Sugarcane'] },
      'MOP': { n: 0, p: 0, k: 60, type: 'Potassic', bestFor: ['Potato', 'Tomato', 'Onion'] },
      'NPK 20:20:20': { n: 20, p: 20, k: 20, type: 'Complex', bestFor: ['All Crops'] },
      'NPK 10:26:26': { n: 10, p: 26, k: 26, type: 'Complex', bestFor: ['Maize', 'Soybean'] },
      'Compost': { n: 1, p: 1, k: 1, type: 'Organic', bestFor: ['All Crops'] },
      'Potassium Nitrate': { n: 13, p: 0, k: 46, type: 'Potassic', bestFor: ['Tomato', 'Potato'] },
      'Single Super Phosphate': { n: 0, p: 16, k: 0, type: 'Phosphatic', bestFor: ['Legumes', 'Pulses'] }
    };
  }

  analyzeNutrientDeficiency(nitrogen, phosphorus, potassium) {
    const deficiencies = [];
    
    if (nitrogen < 50) deficiencies.push({ nutrient: 'Nitrogen', severity: 'High', fertilizer: 'Urea' });
    else if (nitrogen < 100) deficiencies.push({ nutrient: 'Nitrogen', severity: 'Medium', fertilizer: 'Urea' });
    
    if (phosphorus < 30) deficiencies.push({ nutrient: 'Phosphorus', severity: 'High', fertilizer: 'DAP' });
    else if (phosphorus < 60) deficiencies.push({ nutrient: 'Phosphorus', severity: 'Medium', fertilizer: 'DAP' });
    
    if (potassium < 40) deficiencies.push({ nutrient: 'Potassium', severity: 'High', fertilizer: 'MOP' });
    else if (potassium < 80) deficiencies.push({ nutrient: 'Potassium', severity: 'Medium', fertilizer: 'MOP' });
    
    return deficiencies;
  }

  getRecommendation(input) {
    const { nitrogen, phosphorus, potassium, temperature, humidity, soilMoisture, soilType, cropType, rainfall, phLevel } = input;
    
    let recommendedFertilizer = null;
    let confidence = 0;
    let explanation = '';
    let tips = [];
    
    // Analyze nutrient deficiencies
    const deficiencies = this.analyzeNutrientDeficiency(nitrogen, phosphorus, potassium);
    
    // Primary recommendation based on most severe deficiency
    if (deficiencies.length > 0) {
      const primaryDeficiency = deficiencies[0];
      recommendedFertilizer = primaryDeficiency.fertilizer;
      
      if (deficiencies.length === 1) {
        explanation = `Your soil shows ${primaryDeficiency.severity.toLowerCase()} deficiency in ${primaryDeficiency.nutrient}. ${recommendedFertilizer} is recommended to address this specific nutrient gap.`;
        confidence = 85;
      } else if (deficiencies.length === 2) {
        recommendedFertilizer = 'NPK 20:20:20';
        explanation = `Your soil is deficient in multiple nutrients (${deficiencies.map(d => d.nutrient).join(', ')}). A balanced NPK fertilizer will help address all deficiencies simultaneously.`;
        confidence = 90;
      } else {
        recommendedFertilizer = 'Compost';
        explanation = `Your soil has multiple severe deficiencies. Organic compost combined with specific fertilizers would be most beneficial for long-term soil health.`;
        confidence = 95;
      }
    } else {
      // Soil is balanced, recommend based on crop and soil conditions
      recommendedFertilizer = 'NPK 20:20:20';
      explanation = `Your soil nutrient levels are well-balanced. A standard NPK fertilizer will maintain optimal soil health for your ${cropType} crop.`;
      confidence = 75;
    }
    
    // Adjust recommendation based on pH
    if (phLevel < 5.5) {
      tips.push('Soil is acidic. Consider adding lime to raise pH levels for better nutrient absorption.');
      confidence -= 5;
    } else if (phLevel > 7.5) {
      tips.push('Soil is alkaline. Consider adding organic matter or sulfur to lower pH.');
      confidence -= 5;
    }
    
    // Adjust based on temperature
    if (temperature > 35) {
      tips.push('High temperature detected. Apply fertilizer in early morning or evening to prevent evaporation loss.');
      confidence -= 3;
    }
    
    // Adjust based on soil moisture
    if (soilMoisture < 30) {
      tips.push('Soil moisture is low. Irrigate before applying fertilizer for better absorption.');
    } else if (soilMoisture > 70) {
      tips.push('High soil moisture detected. Avoid over-fertilizing to prevent runoff.');
    }
    
    // Crop-specific tips
    if (cropType === 'Rice') {
      tips.push('For rice crops, apply fertilizer in split doses for better yield.');
    } else if (cropType === 'Wheat') {
      tips.push('Wheat responds well to phosphorus at sowing time.');
    } else if (cropType === 'Maize') {
      tips.push('Maize requires high nitrogen during vegetative growth stage.');
    }
    
    // General tips
    tips.push('Always perform a soil test before applying fertilizers.');
    tips.push('Follow recommended application rates to prevent environmental damage.');
    
    // Get application rate
    let applicationRate = '';
    if (deficiencies.length === 0) {
      applicationRate = '100-120 kg/hectare';
    } else if (deficiencies[0].severity === 'High') {
      applicationRate = '150-180 kg/hectare';
    } else {
      applicationRate = '120-150 kg/hectare';
    }
    
    return {
      fertilizer: {
        name: recommendedFertilizer,
        type: this.fertilizerDatabase[recommendedFertilizer]?.type || 'Complex',
        composition: this.fertilizerDatabase[recommendedFertilizer] || null
      },
      confidence: Math.min(98, Math.max(65, confidence)),
      explanation,
      applicationRate,
      tips: tips.slice(0, 5),
      deficiencies: deficiencies
    };
  }
}

module.exports = new AIModel();