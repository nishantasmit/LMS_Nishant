import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { LetterProvider } from './context/LetterContext';
import Login from './components/auth/Login';
import UserDashboard from './components/user/UserDashboard';
import SSMDashboard from './components/ssm/SSMDashboard';
import GMDashboard from './components/gm/GMDashboard';
import PrivateRoute from './utils/PrivateRoute';
import SendToGM from './components/ssm/SendToGM';
import ManageUsers from './components/ssm/ManageUsers';
import VerifyLetters from './components/gm/VerifyLetters';
import SSMReports from './components/ssm/Reports';
import GMReports from './components/gm/Reports';
import ChangePassword from './components/auth/ChangePassword';
import './App.css';

function App() {
  const { logout } = useContext(AuthContext) || {};
  const navigate = window.location;

  useEffect(() => {
    const handlePopState = () => {
      const token = localStorage.getItem('token');
      if (!token && logout) {
        logout();
        window.location.href = '/login';
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [logout]);

  return (
    <AuthProvider>
      <LetterProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Role-based protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <RoleBasedDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/send" 
                element={
                  <PrivateRoute>
                    <SendToGM />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/manage-users" 
                element={
                  <PrivateRoute>
                    <ManageUsers />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/verify" 
                element={
                  <PrivateRoute>
                    <VerifyLetters />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/reports" 
                element={
                  <PrivateRoute>
                    <RoleBasedReports />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/change-password" 
                element={
                  <PrivateRoute>
                    <ChangePassword />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </div>
        </Router>
      </LetterProvider>
    </AuthProvider>
  );
}

// Component to render dashboard based on user role
const RoleBasedDashboard = () => {
  const userRole = localStorage.getItem('role');
  
  switch (userRole) {
    case 'user':
      return <UserDashboard />;
    case 'ssm':
      return <SSMDashboard />;
    case 'gm':
      return <GMDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// Component to render Reports based on user role
const RoleBasedReports = () => {
  const userRole = localStorage.getItem('role');
  if (userRole === 'ssm') return <SSMReports />;
  if (userRole === 'gm') return <GMReports />;
  return <Navigate to="/dashboard" replace />;
};

export default App;
