const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// ── Models ────────────────────────────────────────────────────────────────────
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

// User Schema
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  farmLocation: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.matchPassword = async function(entered) {
  return await bcrypt.compare(entered, this.password);
};
const User = mongoose.model('User', userSchema);

// Recommendation Schema
const recommendationSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nitrogen:       { type: Number, required: true },
  phosphorus:     { type: Number, required: true },
  potassium:      { type: Number, required: true },
  temperature:    { type: Number, required: true },
  humidity:       { type: Number, required: true },
  soilMoisture:   { type: Number, required: true },
  soilType:       { type: String, required: true },
  cropType:       { type: String, required: true },
  rainfall:       { type: Number, required: true },
  phLevel:        { type: Number, required: true },
  fertilizerName: { type: String, required: true },
  fertilizerType: { type: String, required: true },
  confidence:     { type: Number, required: true },
  explanation:    { type: String, required: true },
  applicationRate:{ type: String, required: true },
  tips:           [String],
  createdAt:      { type: Date, default: Date.now }
});
recommendationSchema.index({ user: 1, createdAt: -1 });
const Recommendation = mongoose.model('Recommendation', recommendationSchema);

// ── AI Engine ─────────────────────────────────────────────────────────────────
const fertilizerDB = {
  'Urea':               { n: 46, p: 0,  k: 0,  type: 'Nitrogenous', bestFor: ['Rice','Wheat','Maize','Cotton','Sugarcane'] },
  'DAP':                { n: 18, p: 46, k: 0,  type: 'Phosphatic',  bestFor: ['Wheat','Cotton','Sugarcane','Soybean'] },
  'MOP':                { n: 0,  p: 0,  k: 60, type: 'Potassic',    bestFor: ['Potato','Tomato','Onion','Banana'] },
  'NPK 20:20:20':       { n: 20, p: 20, k: 20, type: 'Complex',     bestFor: ['All Crops'] },
  'NPK 10:26:26':       { n: 10, p: 26, k: 26, type: 'Complex',     bestFor: ['Maize','Soybean','Barley'] },
  'Compost':            { n: 1,  p: 1,  k: 1,  type: 'Organic',     bestFor: ['All Crops'] },
  'Potassium Nitrate':  { n: 13, p: 0,  k: 46, type: 'Potassic',    bestFor: ['Tomato','Potato','Pepper'] },
  'Single Super Phosphate': { n: 0, p: 16, k: 0, type: 'Phosphatic', bestFor: ['Legumes','Pulses','Groundnut'] }
};

function getAIRecommendation(input) {
  const { nitrogen, phosphorus, potassium, temperature, humidity, soilMoisture, soilType, cropType, rainfall, phLevel } = input;
  const scores = {};

  for (const [name, data] of Object.entries(fertilizerDB)) {
    let score = 50;
    const nLow = nitrogen < 50, pLow = phosphorus < 30, kLow = potassium < 40;

    if (nLow && data.n > 20) score += 20;
    if (pLow && data.p > 15) score += 20;
    if (kLow && data.k > 30) score += 20;
    if (!nLow && data.n > 30) score -= 10;
    if (!pLow && data.p > 30) score -= 10;
    if (!kLow && data.k > 40) score -= 10;

    const cropMatch = data.bestFor.some(c =>
      c.toLowerCase() === cropType.toLowerCase() || c === 'All Crops'
    );
    if (cropMatch) score += 15;

    if (phLevel < 6.0 && name === 'Single Super Phosphate') score += 8;
    if (phLevel > 7.5 && name === 'Urea') score += 5;
    if (soilType === 'Sandy' && name === 'Compost') score += 10;
    if (soilMoisture < 30 && name === 'Compost') score += 8;

    scores[name] = Math.min(98, Math.max(55, score));
  }

  const sorted = Object.entries(scores).sort(([,a],[,b]) => b - a);
  const [topName, topScore] = sorted[0];
  const topData = fertilizerDB[topName];

  const tips = [];
  if (phLevel < 5.5) tips.push('Soil is very acidic — consider lime application before fertilizing.');
  if (phLevel > 7.5) tips.push('Alkaline soil — add sulfur or organic matter to lower pH.');
  if (temperature > 35) tips.push('High temperature — apply fertilizer in early morning or evening.');
  if (soilMoisture < 30) tips.push('Low soil moisture — irrigate before applying fertilizer.');
  if (soilMoisture > 70) tips.push('High soil moisture — avoid over-fertilizing to prevent runoff.');
  tips.push('Always perform a soil test before applying fertilizers.');
  tips.push('Follow recommended application rates to prevent environmental damage.');

  const nDef = nitrogen < 50, pDef = phosphorus < 30, kDef = potassium < 40;
  const defList = [nDef && 'Nitrogen', pDef && 'Phosphorus', kDef && 'Potassium'].filter(Boolean);
  const explanation = defList.length > 0
    ? `Soil is deficient in ${defList.join(', ')}. ${topName} (${topData.type}) is recommended to address this for your ${cropType} crop.`
    : `Soil nutrients are balanced. ${topName} will maintain optimal nutrition for your ${cropType} crop.`;

  const applicationRate = topScore > 85 ? '150-180 kg/hectare' : '100-140 kg/hectare';

  return {
    fertilizer: { name: topName, type: topData.type, composition: topData },
    confidence: topScore,
    explanation,
    applicationRate,
    tips: tips.slice(0, 5),
    alternatives: sorted.slice(1, 3).map(([n, s]) => ({ name: n, confidence: s }))
  };
}

// ── JWT Helper ────────────────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'agrifert_secret_key_2024', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });

// ── Auth Middleware ───────────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agrifert_secret_key_2024');
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// ── Express App ───────────────────────────────────────────────────────────────
const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Auth Routes ───────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Please provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/auth/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

app.put('/api/auth/profile', protect, async (req, res) => {
  try {
    const { name, farmLocation } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, { name, farmLocation }, { new: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Recommendation Routes ─────────────────────────────────────────────────────
app.post('/api/recommendations/generate', protect, async (req, res) => {
  try {
    const { nitrogen, phosphorus, potassium, temperature, humidity,
            soilMoisture, soilType, cropType, rainfall, phLevel } = req.body;

    if ([nitrogen, phosphorus, potassium, temperature, humidity,
         soilMoisture, soilType, cropType, rainfall, phLevel].some(v => v === undefined || v === '')) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const aiResult = getAIRecommendation({
      nitrogen: Number(nitrogen), phosphorus: Number(phosphorus), potassium: Number(potassium),
      temperature: Number(temperature), humidity: Number(humidity), soilMoisture: Number(soilMoisture),
      soilType, cropType, rainfall: Number(rainfall), phLevel: Number(phLevel)
    });

    const saved = await Recommendation.create({
      user: req.user._id,
      nitrogen, phosphorus, potassium, temperature, humidity,
      soilMoisture, soilType, cropType, rainfall, phLevel,
      fertilizerName: aiResult.fertilizer.name,
      fertilizerType: aiResult.fertilizer.type,
      confidence:     aiResult.confidence,
      explanation:    aiResult.explanation,
      applicationRate:aiResult.applicationRate,
      tips:           aiResult.tips
    });

    res.status(200).json({
      success: true,
      data: {
        _id:            saved._id,
        fertilizer:     aiResult.fertilizer,
        confidence:     aiResult.confidence,
        explanation:    aiResult.explanation,
        applicationRate:aiResult.applicationRate,
        tips:           aiResult.tips,
        alternatives:   aiResult.alternatives,
        inputData: { nitrogen, phosphorus, potassium, temperature, humidity, soilMoisture, phLevel }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/recommendations/user', protect, async (req, res) => {
  try {
    const recs = await Recommendation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: recs.length, data: recs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/recommendations/:id', protect, async (req, res) => {
  try {
    const rec = await Recommendation.findOne({ _id: req.params.id, user: req.user._id });
    if (!rec) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: rec });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/recommendations/:id', protect, async (req, res) => {
  try {
    const rec = await Recommendation.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!rec) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AgriFert API is running ✅', timestamp: new Date() });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Server error' });
});

// ── Connect DB & Start ────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/fertilizer_recommendation';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🌱 AgriFert Server running on http://localhost:${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
