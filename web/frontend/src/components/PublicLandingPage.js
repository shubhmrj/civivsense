import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Paper,
  Divider,
  LinearProgress,
  Badge,
  Stack
} from '@mui/material';
import {
  Menu as MenuIcon,
  Phone,
  Email,
  LocationOn,
  Download,
  AdminPanelSettings,
  ReportProblem,
  Analytics,
  People,
  Build,
  Water,
  ElectricalServices,
  CleaningServices,
  Construction,
  PlayArrow,
  CheckCircle,
  TrendingUp,
  Speed,
  Security,
  Close,
  GetApp,
  Android,
  Apple,
  Business,
  DirectionsCar,
  Work,
  Park,
  School,
  ArrowBackIos,
  ArrowForwardIos,
  WbSunny,
  AccessTime
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

// Advanced animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const PublicLandingPage = ({ onAdminLogin }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [stats, setStats] = useState({
    totalReports: 1247,
    resolvedReports: 892,
    activeUsers: 15420,
    departments: 8
  });

  useEffect(() => {
    // Simulate real-time stats update
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalReports: prev.totalReports + Math.floor(Math.random() * 3),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const departments = [
    {
      id: 1,
      name: 'Public Works Department',
      icon: <Construction sx={{ fontSize: 40 }} />,
      description: 'Road maintenance, pothole repairs, infrastructure development',
      head: 'Rajesh Kumar Singh',
      contact: '+91-9876543210',
      email: 'pwd@jmc.gov.in',
      totalReports: 521,
      resolved: 398,
      efficiency: 76.4,
      services: ['Road Repair', 'Bridge Maintenance', 'Footpath Construction', 'Street Furniture']
    },
    {
      id: 2,
      name: 'Electrical Department',
      icon: <ElectricalServices sx={{ fontSize: 40 }} />,
      description: 'Street lighting, electrical repairs, power infrastructure',
      head: 'Priya Sharma',
      contact: '+91-9876543211',
      email: 'electrical@jmc.gov.in',
      totalReports: 298,
      resolved: 234,
      efficiency: 78.5,
      services: ['Street Light Repair', 'Electrical Connections', 'Power Supply Issues', 'LED Installation']
    },
    {
      id: 3,
      name: 'Water Department',
      icon: <Water sx={{ fontSize: 40 }} />,
      description: 'Water supply, pipeline maintenance, quality control',
      head: 'Amit Kumar',
      contact: '+91-9876543212',
      email: 'water@jmc.gov.in',
      totalReports: 234,
      resolved: 167,
      efficiency: 71.4,
      services: ['Water Supply', 'Pipeline Repair', 'Water Quality', 'Boring Services']
    },
    {
      id: 4,
      name: 'Sanitation Department',
      icon: <CleaningServices sx={{ fontSize: 40 }} />,
      description: 'Waste management, cleaning services, hygiene maintenance',
      head: 'Sunita Devi',
      contact: '+91-9876543213',
      email: 'sanitation@jmc.gov.in',
      totalReports: 194,
      resolved: 93,
      efficiency: 47.9,
      services: ['Garbage Collection', 'Street Cleaning', 'Drain Cleaning', 'Waste Management']
    }
  ];

  const features = [
    {
      icon: <ReportProblem sx={{ fontSize: 50, color: '#1976d2' }} />,
      title: 'Easy Reporting',
      description: 'Report civic issues with photos and location in seconds'
    },
    {
      icon: <Analytics sx={{ fontSize: 50, color: '#1976d2' }} />,
      title: 'AI-Powered Routing',
      description: 'Smart department assignment with 94.2% accuracy'
    },
    {
      icon: <Speed sx={{ fontSize: 50, color: '#1976d2' }} />,
      title: 'Fast Resolution',
      description: 'Average resolution time of 4.2 days with real-time tracking'
    },
    {
      icon: <Security sx={{ fontSize: 50, color: '#1976d2' }} />,
      title: 'Transparent Process',
      description: 'Blockchain-verified reports with complete transparency'
    }
  ];

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Advanced Header with Glass Effect */}
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'rgba(25, 118, 210, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)'
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img 
              src="/api/placeholder/40/40" 
              alt="Jharkhand Logo" 
              style={{ marginRight: 16, borderRadius: '50%' }}
            />
            <Typography variant="h6" fontWeight="bold">
              Jharkhand Municipal Corporation
            </Typography>
          </Box>

          <Button
            color="inherit"
            startIcon={<AdminPanelSettings />}
            onClick={() => setAdminDialogOpen(true)}
            sx={{ 
              mr: 2,
              '&:hover': {
                background: 'rgba(255,255,255,0.1)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Admin Login
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<Download />}
            onClick={() => setDownloadDialogOpen(true)}
            sx={{ 
              background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
              '&:hover': {
                background: 'linear-gradient(45deg, #ee5a24, #ff6b6b)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.3s ease',
              animation: `${pulse} 2s infinite`
            }}
          >
            Download App
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section with Advanced Background */}
      <Box
        sx={{
          minHeight: '100vh',
          background: `
            linear-gradient(135deg, rgba(25, 118, 210, 0.9) 0%, rgba(21, 101, 192, 0.9) 100%),
            url('/api/placeholder/1920/1080')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            animation: `${float} 6s ease-in-out infinite`
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            animation: `${float} 8s ease-in-out infinite`
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ animation: `${fadeInUp} 1s ease-out` }}>
                <Typography 
                  variant="h2" 
                  fontWeight="bold" 
                  color="white" 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Smart Civic Issue
                  <br />
                  <span style={{ color: '#ffeb3b' }}>Management System</span>
                </Typography>
                
                <Typography 
                  variant="h5" 
                  color="rgba(255,255,255,0.9)" 
                  paragraph
                  sx={{ 
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    animation: `${slideInLeft} 1s ease-out 0.3s both`
                  }}
                >
                  AI-Powered • Transparent • Efficient
                </Typography>

                <Typography 
                  variant="body1" 
                  color="rgba(255,255,255,0.8)" 
                  paragraph
                  sx={{ 
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    animation: `${slideInLeft} 1s ease-out 0.6s both`
                  }}
                >
                  Report civic issues instantly with our mobile app. Get real-time updates, 
                  track progress, and contribute to making Jharkhand a better place to live.
                </Typography>

                <Box sx={{ mt: 4, animation: `${slideInLeft} 1s ease-out 0.9s both` }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Download />}
                    onClick={() => setDownloadDialogOpen(true)}
                    sx={{
                      mr: 2,
                      mb: 2,
                      background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                      fontSize: '1.1rem',
                      py: 1.5,
                      px: 4,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #ee5a24, #ff6b6b)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Download Mobile App
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      fontSize: '1.1rem',
                      py: 1.5,
                      px: 4,
                      '&:hover': {
                        background: 'rgba(255,255,255,0.1)',
                        borderColor: 'white',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Watch Demo
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ animation: `${fadeInUp} 1s ease-out 0.5s both` }}>
                <Paper
                  elevation={24}
                  sx={{
                    p: 3,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                    Live Statistics
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h4" fontWeight="bold" color="primary">
                          {stats.totalReports.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Reports
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h4" fontWeight="bold" color="success.main">
                          {stats.resolvedReports.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Resolved
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h4" fontWeight="bold" color="secondary.main">
                          {stats.activeUsers.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Active Citizens
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h4" fontWeight="bold" color="warning.main">
                          {stats.departments}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Departments
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          textAlign="center" 
          fontWeight="bold" 
          gutterBottom
          sx={{ mb: 6 }}
        >
          Why Choose Our Platform?
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={8}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  },
                  animation: `${fadeInUp} 1s ease-out ${index * 0.2}s both`
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Departments Section */}
      <Box sx={{ bgcolor: '#f8fafc', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            textAlign="center" 
            fontWeight="bold" 
            gutterBottom
            sx={{ mb: 6 }}
          >
            Our Departments
          </Typography>
          
          <Grid container spacing={4}>
            {departments.map((dept, index) => (
              <Grid item xs={12} sm={6} md={3} key={dept.id}>
                <Card
                  elevation={8}
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    },
                    animation: `${fadeInUp} 1s ease-out ${index * 0.1}s both`
                  }}
                  onClick={() => handleDepartmentClick(dept)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {dept.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {dept.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {dept.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={`${dept.efficiency}% Efficiency`}
                        color={dept.efficiency >= 75 ? 'success' : dept.efficiency >= 60 ? 'warning' : 'error'}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Navigation Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Navigation
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            <ListItem button>
              <ListItemIcon><ReportProblem /></ListItemIcon>
              <ListItemText primary="Report Issue" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><Analytics /></ListItemIcon>
              <ListItemText primary="Public Statistics" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><People /></ListItemIcon>
              <ListItemText primary="Departments" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><Phone /></ListItemIcon>
              <ListItemText primary="Contact Us" />
            </ListItem>
            <ListItem button onClick={() => setAdminDialogOpen(true)}>
              <ListItemIcon><AdminPanelSettings /></ListItemIcon>
              <ListItemText primary="Admin Login" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Admin Login Dialog */}
      <Dialog open={adminDialogOpen} onClose={() => setAdminDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Admin Login</Typography>
            <IconButton onClick={() => setAdminDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Access the administrative dashboard to manage civic issues, view analytics, and coordinate departments.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<AdminPanelSettings />}
            onClick={() => {
              setAdminDialogOpen(false);
              onAdminLogin();
            }}
            sx={{ mt: 2 }}
          >
            Go to Admin Dashboard
          </Button>
        </DialogContent>
      </Dialog>

      {/* Download Dialog */}
      <Dialog open={downloadDialogOpen} onClose={() => setDownloadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Download Mobile App</Typography>
            <IconButton onClick={() => setDownloadDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Download our mobile app to report civic issues on the go!
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<Android />}
                sx={{ 
                  background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #8BC34A, #4CAF50)'
                  }
                }}
              >
                Android APK
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<Apple />}
                sx={{ 
                  background: 'linear-gradient(45deg, #333, #666)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #666, #333)'
                  }
                }}
              >
                iOS App
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Department Details Dialog */}
      <Dialog 
        open={!!selectedDepartment} 
        onClose={() => setSelectedDepartment(null)} 
        maxWidth="md" 
        fullWidth
      >
        {selectedDepartment && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {selectedDepartment.icon}
                  <Typography variant="h6" sx={{ ml: 2 }}>
                    {selectedDepartment.name}
                  </Typography>
                </Box>
                <IconButton onClick={() => setSelectedDepartment(null)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Department Information</Typography>
                  <Typography><strong>Head:</strong> {selectedDepartment.head}</Typography>
                  <Typography><strong>Contact:</strong> {selectedDepartment.contact}</Typography>
                  <Typography><strong>Email:</strong> {selectedDepartment.email}</Typography>
                  <Typography><strong>Efficiency:</strong> {selectedDepartment.efficiency}%</Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Performance</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={selectedDepartment.efficiency} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Services Offered</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedDepartment.services.map((service, index) => (
                      <Chip key={index} label={service} variant="outlined" />
                    ))}
                  </Box>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>Statistics</Typography>
                    <Typography>Total Reports: {selectedDepartment.totalReports}</Typography>
                    <Typography>Resolved: {selectedDepartment.resolved}</Typography>
                    <Typography>Success Rate: {((selectedDepartment.resolved / selectedDepartment.totalReports) * 100).toFixed(1)}%</Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          animation: `${pulse} 2s infinite`,
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          '&:hover': {
            background: 'linear-gradient(45deg, #42a5f5, #1976d2)',
            transform: 'scale(1.1)'
          }
        }}
        onClick={() => setDownloadDialogOpen(true)}
      >
        <GetApp />
      </Fab>
    </Box>
  );
};

export default PublicLandingPage;
