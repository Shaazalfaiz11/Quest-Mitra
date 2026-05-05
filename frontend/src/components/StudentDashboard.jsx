import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Activity, Target, Zap, Clock, ChevronRight, BookOpen } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-sm">
        <span className="text-green-500 font-medium">{trend}</span>
        <span className="ml-2 text-slate-500">vs last week</span>
      </div>
    )}
  </div>
);

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);

  const metrics = user?.healthMetrics || {
    engagementRate: 0,
    accuracy: 0,
    completionRate: 0,
    studyConsistency: 0,
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
          <p className="mt-1 text-slate-500">Here's your learning progress for this week.</p>
        </div>
        <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-bold flex items-center shadow-sm">
          <Zap className="w-5 h-5 mr-2 fill-purple-700" />
          {user?.xp || 0} XP
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Engagement Rate" 
          value={`${metrics.engagementRate}%`} 
          icon={Activity} 
          color="bg-blue-500" 
          trend="+5%" 
        />
        <StatCard 
          title="Accuracy" 
          value={`${metrics.accuracy}%`} 
          icon={Target} 
          color="bg-emerald-500" 
          trend="+2%" 
        />
        <StatCard 
          title="Completion Rate" 
          value={`${metrics.completionRate}%`} 
          icon={Zap} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Study Consistency" 
          value={`${metrics.studyConsistency} days`} 
          icon={Clock} 
          color="bg-orange-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Tests */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Assigned Tests</h2>
              <button className="text-sm text-purple-600 font-medium hover:text-purple-700">View all</button>
            </div>
            <div className="p-6">
              <div className="text-center py-10">
                <div className="mx-auto h-12 w-12 text-slate-300 mb-3">
                  <BookOpen className="h-full w-full" />
                </div>
                <h3 className="text-sm font-medium text-slate-900">No active tests</h3>
                <p className="mt-1 text-sm text-slate-500">You're all caught up! Ask your teacher for new assignments.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Study Groups */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">My Groups</h2>
          </div>
          <div className="p-6">
             <div className="text-center py-8">
                <p className="text-sm text-slate-500 mb-4">You haven't joined any groups yet.</p>
                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50">
                  Join a Group
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default StudentDashboard;
