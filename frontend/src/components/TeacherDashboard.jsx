import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Users, BookOpen, CheckCircle, TrendingUp, Plus } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
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
  </div>
);

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h1>
          <p className="mt-1 text-slate-500">Manage your groups and active assessments.</p>
        </div>
        <button 
          onClick={() => navigate('/tests/create')}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium flex items-center hover:bg-purple-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Test
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Students" 
          value="0" 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Active Tests" 
          value="0" 
          icon={BookOpen} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Avg. Class Score" 
          value="0%" 
          icon={CheckCircle} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Improvement" 
          value="+0%" 
          icon={TrendingUp} 
          color="bg-orange-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tests */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Recent Assessments</h2>
            <button className="text-sm text-purple-600 font-medium hover:text-purple-700">View all</button>
          </div>
          <div className="p-6">
            <div className="text-center py-10">
              <div className="mx-auto h-12 w-12 text-slate-300 mb-3">
                <BookOpen className="h-full w-full" />
              </div>
              <h3 className="text-sm font-medium text-slate-900">No tests created yet</h3>
              <p className="mt-1 text-sm text-slate-500">Create your first test to start evaluating students.</p>
            </div>
          </div>
        </div>

        {/* Managed Groups */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">My Groups</h2>
            <button className="text-sm text-purple-600 font-medium hover:text-purple-700">Create Group</button>
          </div>
          <div className="p-6">
             <div className="text-center py-10">
                <div className="mx-auto h-12 w-12 text-slate-300 mb-3">
                  <Users className="h-full w-full" />
                </div>
                <h3 className="text-sm font-medium text-slate-900">No active groups</h3>
                <p className="mt-1 text-sm text-slate-500">Create a group to invite students and assign tests.</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
