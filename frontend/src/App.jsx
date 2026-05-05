import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import TestCreation from './pages/TestCreation'
import TestTaking from './pages/TestTaking'
import BattleRoom from './pages/BattleRoom'
import Analytics from './pages/Analytics'
import Groups from './pages/Groups'
import AiTutor from './pages/AiTutor'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tests" element={<Dashboard />} />
          <Route path="tests/create" element={<TestCreation />} />
          <Route path="tests/:testId/take" element={<TestTaking />} />
          <Route path="battle" element={<BattleRoom />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="groups" element={<Groups />} />
          <Route path="tutor" element={<AiTutor />} />
          <Route path="" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
