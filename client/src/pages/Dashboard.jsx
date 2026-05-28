import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import toast from 'react-hot-toast';
import { FaHistory, FaUser, FaLeaf, FaTrash, FaChartPie } from 'react-icons/fa';

const COLORS = ['#16a34a', '#ca8a04', '#2563eb', '#dc2626', '#7c3aed', '#0891b2'];

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow flex items-center gap-4 border-l-4 ${color}`}>
    <Icon className="text-3xl text-gray-500 dark:text-gray-400" />
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, avgConfidence: 0, topFertilizer: '-', topCrop: '-' });

  useEffect(() => {
    if (!authLoading && !user) { navigate('/auth'); return; }
    if (user) fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const { data } = await API.get('/recommendations/user');
      const recs = data.data || [];
      setRecommendations(recs);

      if (recs.length > 0) {
        const avgConf = Math.round(recs.reduce((s, r) => s + r.confidence, 0) / recs.length);
        const fertCount = {}, cropCount = {};
        recs.forEach(r => {
          fertCount[r.fertilizerName] = (fertCount[r.fertilizerName] || 0) + 1;
          cropCount[r.cropType]       = (cropCount[r.cropType] || 0) + 1;
        });
        const topF = Object.entries(fertCount).sort(([,a],[,b]) => b-a)[0]?.[0] || '-';
        const topC = Object.entries(cropCount).sort(([,a],[,b]) => b-a)[0]?.[0] || '-';
        setStats({ total: recs.length, avgConfidence: avgConf, topFertilizer: topF, topCrop: topC });
      }
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const deleteRec = async (id) => {
    if (!window.confirm('Delete this recommendation?')) return;
    try {
      await API.delete(`/recommendations/${id}`);
      setRecommendations(prev => prev.filter(r => r._id !== id));
      toast.success('Deleted successfully');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  // Chart data
  const fertData = recommendations.reduce((acc, r) => {
    const ex = acc.find(a => a.name === r.fertilizerName);
    ex ? ex.value++ : acc.push({ name: r.fertilizerName, value: 1 });
    return acc;
  }, []);

  const trendData = recommendations.slice().reverse().slice(-10).map((r, i) => ({
    index: i + 1,
    confidence: r.confidence,
    name: r.cropType,
  }));

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <FaUser className="text-green-500" />
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {user?.email} • Member since {new Date(user?.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FaHistory}  label="Total Recommendations" value={stats.total}            color="border-green-500" />
          <StatCard icon={FaChartPie} label="Avg Confidence"        value={`${stats.avgConfidence}%`} color="border-blue-500" />
          <StatCard icon={FaLeaf}     label="Top Fertilizer"        value={stats.topFertilizer}    color="border-yellow-500" />
          <StatCard icon={FaLeaf}     label="Most Analyzed Crop"    value={stats.topCrop}          color="border-purple-500" />
        </div>

        {/* Charts */}
        {recommendations.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Confidence Trend */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Confidence Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="index" />
                  <YAxis domain={[50, 100]} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Confidence']} />
                  <Area type="monotone" dataKey="confidence" stroke="#16a34a" fill="url(#cGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Fertilizer Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Fertilizer Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={fertData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {fertData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* History Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FaHistory className="text-green-500" /> Recommendation History
            </h3>
            <span className="text-sm text-gray-500">{recommendations.length} records</span>
          </div>

          {recommendations.length === 0 ? (
            <div className="p-12 text-center">
              <FaLeaf className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No recommendations yet.</p>
              <button onClick={() => navigate('/ai-recommendation')}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                Get Your First Recommendation
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {['Date', 'Crop', 'Soil', 'Fertilizer', 'Confidence', 'Action'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recommendations.map((rec) => (
                    <tr key={rec._id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {new Date(rec.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{rec.cropType}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rec.soilType}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                          {rec.fertilizerName}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${rec.confidence >= 85 ? 'text-green-600' : rec.confidence >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {rec.confidence}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteRec(rec._id)}
                          className="text-red-500 hover:text-red-700 transition p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
