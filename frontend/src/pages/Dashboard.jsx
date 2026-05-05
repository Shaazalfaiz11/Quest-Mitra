import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import StudentDashboard from '../components/StudentDashboard';
import TeacherDashboard from '../components/TeacherDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  if (user.role === 'Student') {
    return <StudentDashboard />;
  }

  // Admin and Expert get similar views to Teacher for now
  return <TeacherDashboard />;
};

export default Dashboard;
