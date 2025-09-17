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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Stack,
  Chip
} from '@mui/material';
import AnimatedStatsCounter from './AnimatedStatsCounter';
import CitizenTestimonials from './CitizenTestimonials';
import NewsTicker from './NewsTicker';
import InteractiveCityMap from './InteractiveCityMap';
import EmergencyPanel from './EmergencyPanel';
import ChatbotDialog from './ChatbotDialog';
import {
  Menu as MenuIcon,
  AdminPanelSettings,
  Business,
  DirectionsCar,
  Work,
  Park,
  School,
  AccountBalance,
  ArrowBackIos,
  ArrowForwardIos,
  WbSunny,
  AccessTime,
  Close,
  Android,
  Apple,
  GetApp
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

// Advanced animations matching the modern design
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(46, 204, 113, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(46, 204, 113, 0);
  }
`;

const ModernPublicLandingPage = ({ onAdminLogin }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather] = useState({ temp: 24, condition: 'Sunny' });

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  const slides = [
    {
      title: "Smart City for Life",
      subtitle: "We are Always Open for World",
      description: "Building a sustainable and connected future for Jharkhand citizens",
      background: "linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
    },
    {
      title: "All City in Your Hand",
      subtitle: "3 Millions of Tourists Every Year",
      description: "Experience seamless civic services through our digital platform",
      background: "linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
    }
  ];

  const services = [
    {
      icon: <Business sx={{ fontSize: 40, color: '#2ecc71' }} />,
      title: 'BUSINESS',
      description: 'Business registration, licenses, and permits'
    },
    {
      icon: <AccountBalance sx={{ fontSize: 40, color: '#2ecc71' }} />,
      title: 'GOVERNMENT',
      description: 'Government services and civic administration'
    },
    {
      icon: <DirectionsCar sx={{ fontSize: 40, color: '#2ecc71' }} />,
      title: 'TRAFFIC & PARKING',
      description: 'Traffic management and parking solutions'
    },
    {
      icon: <Work sx={{ fontSize: 40, color: '#2ecc71' }} />,
      title: 'CITY JOB',
      description: 'Employment opportunities and job portal'
    },
    {
      icon: <Park sx={{ fontSize: 40, color: '#2ecc71' }} />,
      title: 'RECREATION',
      description: 'Parks, events, and recreational facilities'
    },
    {
      icon: <School sx={{ fontSize: 40, color: '#2ecc71' }} />,
      title: 'EDUCATION',
      description: 'Schools, colleges, and educational services'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Modern Header - theGov Style */}
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
          color: '#333'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold',
                color: '#333',
                mr: 4
              }}
            >
              the<span style={{ color: '#2ecc71' }}>Gov</span>
            </Typography>
          </Box>

          {/* Navigation Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
            <Button 
              sx={{ 
                color: '#333', 
                fontWeight: 500,
                '&:hover': { color: '#2ecc71' },
                transition: 'all 0.3s ease'
              }}
            >
              Home
            </Button>
            <Button 
              sx={{ 
                color: '#333', 
                fontWeight: 500,
                '&:hover': { color: '#2ecc71' },
                transition: 'all 0.3s ease'
              }}
            >
              Pages
            </Button>
            <Button 
              sx={{ 
                color: '#333', 
                fontWeight: 500,
                '&:hover': { color: '#2ecc71' },
                transition: 'all 0.3s ease'
              }}
            >
              Events
            </Button>
            <Button 
              sx={{ 
                color: '#333', 
                fontWeight: 500,
                '&:hover': { color: '#2ecc71' },
                transition: 'all 0.3s ease'
              }}
            >
              Blog
            </Button>
            <Button 
              sx={{ 
                color: '#333', 
                fontWeight: 500,
                '&:hover': { color: '#2ecc71' },
                transition: 'all 0.3s ease'
              }}
            >
              Portfolio
            </Button>
            <Button 
              sx={{ 
                color: '#333', 
                fontWeight: 500,
                '&:hover': { color: '#2ecc71' },
                transition: 'all 0.3s ease'
              }}
            >
              Shop
            </Button>
            <Button 
              sx={{ 
                color: '#333', 
                fontWeight: 500,
                '&:hover': { color: '#2ecc71' },
                transition: 'all 0.3s ease'
              }}
            >
              Contact Us
            </Button>
            
            <Button
              variant="contained"
              sx={{
                background: '#2ecc71',
                color: 'white',
                fontWeight: 'bold',
                px: 3,
                py: 1,
                borderRadius: '25px',
                '&:hover': {
                  background: '#27ae60',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(46, 204, 113, 0.3)'
                },
                transition: 'all 0.3s ease',
                animation: `${pulse} 2s infinite`
              }}
              onClick={() => setAdminDialogOpen(true)}
            >
              ADMIN LOGIN
            </Button>
          </Box>

          {/* Mobile Menu */}
          <IconButton 
            sx={{ display: { xs: 'block', md: 'none' }, color: '#333' }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Hero Section with Slider */}
      <Box
        sx={{
          minHeight: '100vh',
          background: slides[currentSlide].background,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Weather Widget */}
        <Box
          sx={{
            position: 'absolute',
            top: 120,
            right: 40,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            p: 2,
            color: 'white',
            textAlign: 'center',
            animation: `${fadeInUp} 1s ease-out 0.5s both`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <WbSunny sx={{ mr: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {weather.temp}°C
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTime sx={{ mr: 1, fontSize: 16 }} />
            <Typography variant="caption">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })} LOCAL TIME
            </Typography>
          </Box>
        </Box>

        {/* Slide Navigation Arrows */}
        <IconButton
          onClick={prevSlide}
          sx={{
            position: 'absolute',
            left: 40,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            '&:hover': {
              background: 'rgba(255,255,255,0.3)',
              transform: 'translateY(-50%) scale(1.1)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <ArrowBackIos />
        </IconButton>

        <IconButton
          onClick={nextSlide}
          sx={{
            position: 'absolute',
            right: 40,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            '&:hover': {
              background: 'rgba(255,255,255,0.3)',
              transform: 'translateY(-50%) scale(1.1)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <ArrowForwardIos />
        </IconButton>

        {/* Hero Content */}
        <Container maxWidth="lg">
          <Grid container>
            <Grid item xs={12} md={8}>
              <Box sx={{ animation: `${slideInLeft} 1s ease-out` }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '1.1rem',
                    mb: 2,
                    animation: `${fadeInUp} 1s ease-out 0.2s both`
                  }}
                >
                  {slides[currentSlide].subtitle}
                </Typography>
                
                <Typography 
                  variant="h1" 
                  sx={{ 
                    color: 'white',
                    fontSize: { xs: '3rem', md: '5rem' },
                    fontWeight: 'bold',
                    lineHeight: 1.1,
                    mb: 3,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    animation: `${fadeInUp} 1s ease-out 0.4s both`
                  }}
                >
                  {slides[currentSlide].title}
                </Typography>

                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '1.2rem',
                    mb: 4,
                    maxWidth: 600,
                    animation: `${fadeInUp} 1s ease-out 0.6s both`
                  }}
                >
                  {slides[currentSlide].description}
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: '25px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.3)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                    },
                    transition: 'all 0.3s ease',
                    animation: `${fadeInUp} 1s ease-out 0.8s both`
                  }}
                  onClick={() => setDownloadDialogOpen(true)}
                >
                  LEARN MORE
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Slide Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1
          }}
        >
          {slides.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentSlide(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'white',
                  transform: 'scale(1.2)'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: 8, mt: -6, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={3}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <Card
                elevation={8}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  background: 'white',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    '& .service-icon': {
                      transform: 'scale(1.1)',
                      animation: `${float} 2s ease-in-out infinite`
                    }
                  },
                  animation: `${fadeInUp} 1s ease-out ${index * 0.1}s both`
                }}
              >
                <Box className="service-icon" sx={{ mb: 2, transition: 'all 0.3s ease' }}>
                  {service.icon}
                </Box>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ fontSize: '0.9rem', color: '#333' }}
                >
                  {service.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: '0.8rem' }}
                >
                  {service.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Interactive 3D City Map */}
      <Box sx={{ py: 8, background: '#eef2f3' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center" mb={4}>
            City Issue Hotspots
          </Typography>
          <InteractiveCityMap height={500} />
        </Container>
      </Box>

      {/* News Ticker */}
      <NewsTicker />

      {/* Live Statistics Counter */}
      <AnimatedStatsCounter />

      {/* Citizen Testimonials */}
      <CitizenTestimonials />

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
            sx={{ 
              mt: 2,
              background: '#2ecc71',
              '&:hover': { background: '#27ae60' }
            }}
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
            Download our mobile app to report civic issues and access city services on the go!
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

      {/* Floating Download Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          zIndex: 1000
        }}
      >
        <Button
          variant="contained"
          sx={{
            background: '#2ecc71',
            color: 'white',
            fontWeight: 'bold',
            px: 3,
            py: 1.5,
            borderRadius: '25px',
            boxShadow: '0 8px 25px rgba(46, 204, 113, 0.3)',
            '&:hover': {
              background: '#27ae60',
              transform: 'translateY(-3px)',
              boxShadow: '0 12px 35px rgba(46, 204, 113, 0.4)'
            },
            transition: 'all 0.3s ease',
            animation: `${pulse} 3s infinite`
          }}
          startIcon={<GetApp />}
          onClick={() => setDownloadDialogOpen(true)}
        >
          Download App
        </Button>
      </Box>

      {/* Emergency Services Quick Access */}
      <EmergencyPanel position={{ bottom: 30, left: 30 }} />

      {/* AI Chatbot */}
      <ChatbotDialog position={{ bottom: 110, right: 30 }} />

    </Box>
  );
};

export default ModernPublicLandingPage;
