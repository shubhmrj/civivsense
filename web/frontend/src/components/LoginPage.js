import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import {
  AdminPanelSettings,
  Security,
  Dashboard,
  Analytics,
  LocationOn
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const LoginPage = ({ onLogin, onBack }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Demo credentials for all user roles
      const validCredentials = {
        'admin@city.gov': {
          password: 'admin123',
          userData: {
            id: 1,
            name: 'Municipal Administrator',
            email: 'admin@city.gov',
            role: 'admin',
            department: 'Jharkhand Municipal Corporation',
            city: 'Ranchi',
            permissions: ['view_reports', 'manage_departments', 'view_analytics', 'manage_users', 'assign_teams', 'blockchain_verify']
          }
        },
        'dept@city.gov': {
          password: 'dept123',
          userData: {
            id: 2,
            name: 'Department Head - Public Works',
            email: 'dept@city.gov',
            role: 'department_head',
            department: 'Public Works Department',
            city: 'Ranchi',
            permissions: ['view_reports', 'assign_teams', 'manage_staff', 'update_status', 'view_analytics']
          }
        },
        'field@city.gov': {
          password: 'field123',
          userData: {
            id: 3,
            name: 'Field Officer - PWD',
            email: 'field@city.gov',
            role: 'field_officer',
            department: 'Public Works Department',
            city: 'Ranchi',
            permissions: ['view_reports', 'update_status', 'upload_resolution', 'field_verification']
          }
        }
      };

      const userCredential = validCredentials[credentials.email];
      
      if (userCredential && userCredential.password === credentials.password) {
        const token = `${userCredential.userData.role}-token-` + Date.now();
        
        toast.success(`Welcome to Jharkhand Municipal Corporation Dashboard, ${userCredential.userData.name}!`);
        onLogin(userCredential.userData, token);
      } else {
        setError('Invalid credentials. Please check email and password.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
    { role: 'Admin', email: 'admin@city.gov', password: 'admin123' },
    { role: 'Department Head', email: 'dept@city.gov', password: 'dept123' },
    { role: 'Field Officer', email: 'field@city.gov', password: 'field123' }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {/* Left side - Login Form */}
          <Paper
            elevation={10}
            sx={{
              padding: 4,
              borderRadius: 3,
              minWidth: 400,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <AdminPanelSettings sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="h1" gutterBottom color="primary">
                Jharkhand Municipal Corporation
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Smart Civic Issue Management System - Ranchi
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                placeholder="admin@city.gov"
              />
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                placeholder="Enter your password"
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Security sx={{ mr: 1 }} />
                    Sign In to Dashboard
                  </>
                )}
              </Button>
            </form>

            <Divider sx={{ my: 2 }}>
              <Chip label="Demo Credentials" size="small" />
            </Divider>

            <Box sx={{ mt: 2 }}>
              {demoCredentials.map((cred, index) => (
                <Card key={index} sx={{ mb: 1, bgcolor: 'grey.50' }}>
                  <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
                    <Typography variant="body2" fontWeight="bold">
                      {cred.role}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {cred.email} / {cred.password}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>

          {/* Right side - Features */}
          <Box sx={{ color: 'white', maxWidth: 500 }}>
            <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
              Civic Issue Management System
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Empowering municipalities with AI-powered civic issue reporting and blockchain transparency
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Dashboard sx={{ fontSize: 40, opacity: 0.8 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Real-time Dashboard
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Monitor civic issues, track resolution progress, and manage departments
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Analytics sx={{ fontSize: 40, opacity: 0.8 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    AI-Powered Analytics
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Automatic categorization, priority scoring, and predictive insights
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOn sx={{ fontSize: 40, opacity: 0.8 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Interactive Map View
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Visualize reports geographically and identify hotspots
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Security sx={{ fontSize: 40, opacity: 0.8 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Blockchain Transparency
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Immutable records and transparent tracking for accountability
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                <strong>Demo Features:</strong> Live report management, real-time analytics, 
                department assignment, blockchain verification, and AI-powered insights.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
