import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  CheckCircle,
  People,
  Speed,
  Assessment,
  Schedule,
  Star,
  LocationCity
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

// Animation for counting up numbers
const countUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Pulse animation for achievement badges
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

// Floating animation for icons
const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const AnimatedStatsCounter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    totalReports: 0,
    resolvedReports: 0,
    activeCitizens: 0,
    avgResolutionTime: 0,
    satisfactionRate: 0,
    departments: 0,
    monthlyReports: 0,
    efficiency: 0
  });

  const statsRef = useRef(null);

  // Target values for animation
  const targetValues = {
    totalReports: 1247,
    resolvedReports: 892,
    activeCitizens: 15420,
    avgResolutionTime: 4.2,
    satisfactionRate: 94.5,
    departments: 8,
    monthlyReports: 156,
    efficiency: 87.3
  };

  // Intersection Observer to trigger animation when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  // Animated counter function
  const animateCounter = (start, end, duration, callback) => {
    const startTime = Date.now();
    const range = end - start;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + (range * easeOutQuart);
      
      callback(current);

      if (progress === 1) {
        clearInterval(timer);
      }
    }, 16); // ~60fps
  };

  // Start animations when visible
  useEffect(() => {
    if (isVisible) {
      // Animate each counter with different delays
      Object.keys(targetValues).forEach((key, index) => {
        setTimeout(() => {
          animateCounter(0, targetValues[key], 2000, (value) => {
            setCounts(prev => ({
              ...prev,
              [key]: key === 'avgResolutionTime' || key === 'satisfactionRate' || key === 'efficiency' ? 
                     parseFloat(value.toFixed(1)) : Math.floor(value)
            }));
          });
        }, index * 200); // Stagger animations
      });
    }
  }, [isVisible]);

  const statsData = [
    {
      icon: <Assessment sx={{ fontSize: 50, color: '#3498db' }} />,
      title: 'Total Reports',
      value: counts.totalReports.toLocaleString(),
      subtitle: '+156 this month',
      color: '#3498db',
      trend: '+12.5%'
    },
    {
      icon: <CheckCircle sx={{ fontSize: 50, color: '#2ecc71' }} />,
      title: 'Resolved Issues',
      value: counts.resolvedReports.toLocaleString(),
      subtitle: '71.5% success rate',
      color: '#2ecc71',
      trend: '+8.3%'
    },
    {
      icon: <People sx={{ fontSize: 50, color: '#e74c3c' }} />,
      title: 'Active Citizens',
      value: counts.activeCitizens.toLocaleString(),
      subtitle: 'Registered users',
      color: '#e74c3c',
      trend: '+15.2%'
    },
    {
      icon: <Schedule sx={{ fontSize: 50, color: '#f39c12' }} />,
      title: 'Avg Resolution',
      value: `${counts.avgResolutionTime} days`,
      subtitle: 'Response time',
      color: '#f39c12',
      trend: '-18.7%'
    },
    {
      icon: <Star sx={{ fontSize: 50, color: '#9b59b6' }} />,
      title: 'Satisfaction Rate',
      value: `${counts.satisfactionRate}%`,
      subtitle: 'Citizen feedback',
      color: '#9b59b6',
      trend: '+5.1%'
    },
    {
      icon: <LocationCity sx={{ fontSize: 50, color: '#1abc9c' }} />,
      title: 'Departments',
      value: counts.departments,
      subtitle: 'Active departments',
      color: '#1abc9c',
      trend: 'Stable'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 50, color: '#34495e' }} />,
      title: 'Monthly Reports',
      value: counts.monthlyReports,
      subtitle: 'This month',
      color: '#34495e',
      trend: '+22.1%'
    },
    {
      icon: <Speed sx={{ fontSize: 50, color: '#e67e22' }} />,
      title: 'System Efficiency',
      value: `${counts.efficiency}%`,
      subtitle: 'Overall performance',
      color: '#e67e22',
      trend: '+11.4%'
    }
  ];

  return (
    <Box
      ref={statsRef}
      sx={{
        py: 8,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)
          `,
          zIndex: 1
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              animation: isVisible ? `${countUp} 1s ease-out` : 'none'
            }}
          >
            Live City Statistics
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              maxWidth: 600,
              mx: 'auto',
              animation: isVisible ? `${countUp} 1s ease-out 0.3s both` : 'none'
            }}
          >
            Real-time data showcasing our commitment to transparent governance and efficient civic services
          </Typography>
        </Box>

        {/* Statistics Grid */}
        <Grid container spacing={3}>
          {statsData.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                elevation={12}
                sx={{
                  height: '100%',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  animation: isVisible ? `${countUp} 1s ease-out ${index * 0.1}s both` : 'none',
                  '&:hover': {
                    transform: 'translateY(-10px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    '& .stat-icon': {
                      animation: `${float} 2s ease-in-out infinite`,
                      transform: 'scale(1.1)'
                    },
                    '& .trend-indicator': {
                      animation: `${pulse} 1.5s infinite`
                    }
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  {/* Icon */}
                  <Box
                    className="stat-icon"
                    sx={{
                      mb: 2,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {stat.icon}
                  </Box>

                  {/* Main Value */}
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      color: stat.color,
                      mb: 1,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                    }}
                  >
                    {stat.value}
                  </Typography>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#2c3e50',
                      mb: 1
                    }}
                  >
                    {stat.title}
                  </Typography>

                  {/* Subtitle */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mb: 2
                    }}
                  >
                    {stat.subtitle}
                  </Typography>

                  {/* Progress Bar */}
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((parseInt(String(stat.value).replace(/[^\d]/g, '')) / targetValues[Object.keys(targetValues)[index]]) * 100, 100)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: stat.color,
                        borderRadius: 3
                      }
                    }}
                  />

                  {/* Trend Indicator */}
                  <Box
                    className="trend-indicator"
                    sx={{
                      mt: 2,
                      display: 'inline-flex',
                      alignItems: 'center',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      background: stat.trend.includes('+') ? 'rgba(46, 204, 113, 0.1)' : 
                                 stat.trend.includes('-') ? 'rgba(231, 76, 60, 0.1)' : 
                                 'rgba(149, 165, 166, 0.1)',
                      color: stat.trend.includes('+') ? '#27ae60' : 
                             stat.trend.includes('-') ? '#c0392b' : '#7f8c8d'
                    }}
                  >
                    <TrendingUp 
                      sx={{ 
                        fontSize: 16, 
                        mr: 0.5,
                        transform: stat.trend.includes('-') ? 'rotate(180deg)' : 'none'
                      }} 
                    />
                    <Typography variant="caption" fontWeight="bold">
                      {stat.trend}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Achievement Badges */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 3,
              animation: isVisible ? `${countUp} 1s ease-out 1s both` : 'none'
            }}
          >
            🏆 Recent Achievements
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {[
              { title: 'Best Digital Initiative 2024', icon: '🥇' },
              { title: 'Citizen Satisfaction Award', icon: '⭐' },
              { title: 'Smart City Recognition', icon: '🏙️' },
              { title: 'Transparency Excellence', icon: '🔍' }
            ].map((achievement, index) => (
              <Grid item key={index}>
                <Box
                  sx={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    p: 2,
                    color: 'white',
                    textAlign: 'center',
                    minWidth: 150,
                    transition: 'all 0.3s ease',
                    animation: isVisible ? `${pulse} 2s infinite ${index * 0.5}s` : 'none',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.2)',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {achievement.icon}
                  </Typography>
                  <Typography variant="caption" fontWeight="bold">
                    {achievement.title}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AnimatedStatsCounter;
