import React from 'react';
import { BarChart2, TrendingUp, Target, Brain, AlertTriangle } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

const weeklyData = [
  { day: 'Mon', engagement: 72, accuracy: 65, consistency: 80 },
  { day: 'Tue', engagement: 80, accuracy: 70, consistency: 85 },
  { day: 'Wed', engagement: 65, accuracy: 75, consistency: 70 },
  { day: 'Thu', engagement: 90, accuracy: 82, consistency: 90 },
  { day: 'Fri', engagement: 85, accuracy: 78, consistency: 88 },
  { day: 'Sat', engagement: 60, accuracy: 60, consistency: 50 },
  { day: 'Sun', engagement: 40, accuracy: 55, consistency: 40 },
];

const subjectData = [
  { subject: 'Physics', score: 78, tests: 5 },
  { subject: 'Chemistry', score: 65, tests: 4 },
  { subject: 'Math', score: 88, tests: 6 },
  { subject: 'Biology', score: 72, tests: 3 },
  { subject: 'English', score: 92, tests: 4 },
];

const radarData = [
  { concept: 'Mechanics', value: 85, fullMark: 100 },
  { concept: 'Thermodynamics', value: 60, fullMark: 100 },
  { concept: 'Optics', value: 72, fullMark: 100 },
  { concept: 'Electromagnetism', value: 45, fullMark: 100 },
  { concept: 'Waves', value: 78, fullMark: 100 },
  { concept: 'Nuclear', value: 55, fullMark: 100 },
];

const retentionData = [
  { week: 'W1', retention: 95 },
  { week: 'W2', retention: 88 },
  { week: 'W3', retention: 82 },
  { week: 'W4', retention: 75 },
  { week: 'W5', retention: 70 },
  { week: 'W6', retention: 68 },
];

const MetricCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {change && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
    <p className="text-sm text-slate-500 mt-1">{title}</p>
  </div>
);

const Analytics = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Analytics & Insights</h1>
        <p className="mt-1 text-slate-500">Track your learning progress and identify areas for improvement.</p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <MetricCard title="Overall Accuracy" value="74%" change={5} icon={Target} color="bg-emerald-500" />
        <MetricCard title="Weekly Streak" value="4 days" change={2} icon={TrendingUp} color="bg-purple-500" />
        <MetricCard title="Concepts Mastered" value="12/20" icon={Brain} color="bg-blue-500" />
        <MetricCard title="Weak Zones" value="3 topics" change={-1} icon={AlertTriangle} color="bg-amber-500" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Performance Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Weekly Performance</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" fontSize={12} stroke="#94a3b8" />
              <YAxis fontSize={12} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)' }}
              />
              <Legend />
              <Area type="monotone" dataKey="engagement" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorEngagement)" strokeWidth={2} />
              <Area type="monotone" dataKey="accuracy" stroke="#10b981" fillOpacity={1} fill="url(#colorAccuracy)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Knowledge Graph (Radar) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Knowledge Graph</h2>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="concept" fontSize={12} stroke="#64748b" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={10} stroke="#94a3b8" />
              <Radar name="Mastery" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Subject-wise Performance */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Subject Performance</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={subjectData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="subject" fontSize={12} stroke="#94a3b8" />
              <YAxis fontSize={12} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)' }}
              />
              <Bar dataKey="score" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Retention Rate */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Retention Rate Over Time</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" fontSize={12} stroke="#94a3b8" />
              <YAxis fontSize={12} stroke="#94a3b8" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)' }}
              />
              <Line type="monotone" dataKey="retention" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weak Zone Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start">
          <AlertTriangle className="w-6 h-6 text-amber-600 mr-4 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-amber-800 mb-2">Weak Zones Identified</h3>
            <p className="text-amber-700 text-sm mb-4">Our AI has identified the following topics that need your attention:</p>
            <div className="flex flex-wrap gap-2">
              {['Electromagnetism', 'Nuclear Physics', 'Thermodynamics'].map(topic => (
                <span key={topic} className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-sm font-medium border border-amber-200">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
