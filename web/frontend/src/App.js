import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ModernPublicLandingPage from './components/ModernPublicLandingPage';
import LoginPage from './components/LoginPage';
import AdvancedDashboard from './components/AdvancedDashboard';
import ReportsPage from './components/ReportsPage';
import AnalyticsPage from './components/AnalyticsPage';
import DepartmentsPage from './components/DepartmentsPage';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
      light: '#42a5f5',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState('public'); // 'public', 'login', 'dashboard'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      setCurrentView('dashboard');
    }
    setLoading(false);
  }, []);

  const handleAdminLogin = () => {
    setCurrentView('login');
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('public');
  };

  const handleBackToPublic = () => {
    setCurrentView('public');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading SIH Civic Dashboard...</div>
      </div>
    );
  }

  // Render different views based on current state
  const renderCurrentView = () => {
    switch (currentView) {
      case 'public':
        return <ModernPublicLandingPage onAdminLogin={handleAdminLogin} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onBack={handleBackToPublic} />;
      case 'dashboard':
        return (
          <Routes>
            <Route path="/" element={<AdvancedDashboard user={user} onLogout={handleLogout} />} />
            <Route path="/reports" element={<ReportsPage user={user} onLogout={handleLogout} />} />
            <Route path="/analytics" element={<AnalyticsPage user={user} onLogout={handleLogout} />} />
            <Route path="/departments" element={<DepartmentsPage user={user} onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        );
      default:
        return <ModernPublicLandingPage onAdminLogin={handleAdminLogin} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          {renderCurrentView()}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
