import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { FaSeedling, FaTint, FaTemperatureHigh, FaCloudRain, FaFlask, FaLeaf, FaChartBar, FaCheckCircle } from 'react-icons/fa';

const soilTypes = ['Loamy', 'Sandy', 'Clayey', 'Peaty', 'Saline', 'Chalky'];
const cropTypes = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Potato', 'Tomato', 'Onion', 'Soybean', 'Barley'];

const InputField = ({ label, name, icon: Icon, register, errors, min, max, step = "1", placeholder }) => (
  <div>
    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300 flex items-center gap-1">
      {Icon && <Icon className="text-green-500" />} {label}
    </label>
    <input
      type="number"
      step={step}
      min={min}
      max={max}
      placeholder={placeholder}
      {...register(name, { required: `${label} is required`, min: { value: min, message: `Min ${min}` }, max: { value: max, message: `Max ${max}` } })}
      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
    />
    {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
  </div>
);

const AIRecommendation = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [loading, setLoading]             = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('Please login to get AI recommendations');
      navigate('/auth');
      return;
    }
    setLoading(true);
    try {
      const response = await API.post('/recommendations/generate', {
        ...data,
        nitrogen:    Number(data.nitrogen),
        phosphorus:  Number(data.phosphorus),
        potassium:   Number(data.potassium),
        temperature: Number(data.temperature),
        humidity:    Number(data.humidity),
        soilMoisture:Number(data.soilMoisture),
        rainfall:    Number(data.rainfall),
        phLevel:     Number(data.phLevel),
      });
      setRecommendation(response.data.data);
      toast.success('AI recommendation generated successfully! 🌱');
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate recommendation');
    } finally {
      setLoading(false);
    }
  };

  const confidenceColor = (c) => c >= 85 ? 'text-green-600' : c >= 70 ? 'text-yellow-600' : 'text-red-600';
  const confidenceBg    = (c) => c >= 85 ? 'bg-green-500' : c >= 70 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent">
            AI Fertilizer Recommendation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Enter your soil and crop details for a personalized AI-powered recommendation
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* NPK Section */}
            <h3 className="text-lg font-bold text-green-600 mb-4 flex items-center gap-2 border-b pb-2">
              <FaFlask /> Soil Nutrient Levels (kg/ha)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <InputField label="Nitrogen (N)" name="nitrogen" icon={FaLeaf} register={register} errors={errors} min={0} max={300} placeholder="e.g. 80" />
              <InputField label="Phosphorus (P)" name="phosphorus" icon={FaLeaf} register={register} errors={errors} min={0} max={200} placeholder="e.g. 40" />
              <InputField label="Potassium (K)" name="potassium" icon={FaLeaf} register={register} errors={errors} min={0} max={300} placeholder="e.g. 60" />
            </div>

            {/* Climate Section */}
            <h3 className="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2 border-b pb-2">
              <FaCloudRain /> Climate & Moisture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <InputField label="Temperature (°C)" name="temperature" icon={FaTemperatureHigh} register={register} errors={errors} min={-10} max={60} placeholder="e.g. 28" />
              <InputField label="Humidity (%)" name="humidity" icon={FaTint} register={register} errors={errors} min={0} max={100} placeholder="e.g. 65" />
              <InputField label="Soil Moisture (%)" name="soilMoisture" icon={FaTint} register={register} errors={errors} min={0} max={100} placeholder="e.g. 45" />
              <InputField label="Rainfall (mm)" name="rainfall" icon={FaCloudRain} register={register} errors={errors} min={0} max={500} placeholder="e.g. 80" />
            </div>

            {/* Soil & Crop Section */}
            <h3 className="text-lg font-bold text-yellow-600 mb-4 flex items-center gap-2 border-b pb-2">
              <FaSeedling /> Soil & Crop Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* pH */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">pH Level</label>
                <input type="number" step="0.1" min="0" max="14" placeholder="e.g. 6.5"
                  {...register('phLevel', { required: 'pH is required', min: { value: 0, message: 'Min 0' }, max: { value: 14, message: 'Max 14' } })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                {errors.phLevel && <p className="text-red-500 text-xs mt-1">{errors.phLevel.message}</p>}
              </div>

              {/* Soil Type */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Soil Type</label>
                <select {...register('soilType', { required: 'Soil type is required' })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition">
                  <option value="">Select soil type</option>
                  {soilTypes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.soilType && <p className="text-red-500 text-xs mt-1">{errors.soilType.message}</p>}
              </div>

              {/* Crop Type */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Crop Type</label>
                <select {...register('cropType', { required: 'Crop type is required' })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition">
                  <option value="">Select crop type</option>
                  {cropTypes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.cropType && <p className="text-red-500 text-xs mt-1">{errors.cropType.message}</p>}
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={loading}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-600 transition disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? (
                  <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Analyzing...</>
                ) : (
                  <><FaSeedling /> Get AI Recommendation</>
                )}
              </button>
              <button type="button" onClick={() => { reset(); setRecommendation(null); }}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Result Card */}
        {recommendation && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
              <FaCheckCircle /> AI Recommendation Result
            </h2>

            {/* Main Fertilizer */}
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/30 dark:to-yellow-900/30 rounded-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Recommended Fertilizer</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {recommendation.fertilizer?.name || recommendation.fertilizerName}
                  </h3>
                  <span className="inline-block mt-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-medium rounded-full">
                    {recommendation.fertilizer?.type || recommendation.fertilizerType}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">AI Confidence</p>
                  <p className={`text-5xl font-bold ${confidenceColor(recommendation.confidence)}`}>
                    {recommendation.confidence}%
                  </p>
                  <div className="w-32 h-3 bg-gray-200 dark:bg-gray-600 rounded-full mt-2 mx-auto">
                    <div className={`h-3 rounded-full ${confidenceBg(recommendation.confidence)} transition-all duration-1000`}
                      style={{ width: `${recommendation.confidence}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="mb-6">
              <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">📋 AI Analysis</h4>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                {recommendation.explanation}
              </p>
            </div>

            {/* Application Rate + Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                  <FaChartBar /> Application Rate
                </h4>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {recommendation.applicationRate}
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                <h4 className="font-bold text-yellow-700 dark:text-yellow-400 mb-2">💡 Application Tips</h4>
                <ul className="space-y-1">
                  {recommendation.tips?.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5">•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Alternatives */}
            {recommendation.alternatives && recommendation.alternatives.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3">🔄 Alternative Fertilizers</h4>
                <div className="flex flex-wrap gap-3">
                  {recommendation.alternatives.map((alt, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{alt.name}</span>
                      <span className={`text-sm font-bold ${confidenceColor(alt.confidence)}`}>{alt.confidence}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendation;
