import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Avatar,
  Rating,
  IconButton,
  Grid,
  Chip
} from '@mui/material';
import {
  ArrowBackIos,
  ArrowForwardIos,
  FormatQuote,
  Verified,
  LocationOn,
  CheckCircle
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
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
    transform: translateY(-10px);
  }
`;

const CitizenTestimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Sample testimonials data - in real app, this would come from API
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Ranchi, Jharkhand",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      testimonial: "The new civic reporting system is amazing! I reported a pothole issue and it was fixed within 3 days. The transparency and real-time updates made all the difference.",
      issueType: "Road Maintenance",
      resolvedIn: "3 days",
      verified: true,
      date: "2024-01-15"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Dhanbad, Jharkhand",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      testimonial: "Excellent service! The water supply issue in our area was resolved quickly after reporting through the app. The department coordination was seamless.",
      issueType: "Water Supply",
      resolvedIn: "2 days",
      verified: true,
      date: "2024-01-10"
    },
    {
      id: 3,
      name: "Anita Devi",
      location: "Jamshedpur, Jharkhand",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 4,
      testimonial: "Great initiative by the municipal corporation! The street light issue was addressed promptly. Love the photo updates showing the progress.",
      issueType: "Street Lighting",
      resolvedIn: "5 days",
      verified: true,
      date: "2024-01-08"
    },
    {
      id: 4,
      name: "Suresh Mahto",
      location: "Bokaro, Jharkhand",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      testimonial: "The garbage collection complaint I raised was handled professionally. The real-time tracking feature helped me stay updated throughout the process.",
      issueType: "Waste Management",
      resolvedIn: "1 day",
      verified: true,
      date: "2024-01-05"
    },
    {
      id: 5,
      name: "Meera Singh",
      location: "Hazaribagh, Jharkhand",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      testimonial: "Impressed with the transparency and efficiency! The park maintenance issue was resolved with regular updates. This system has transformed civic services.",
      issueType: "Parks & Recreation",
      resolvedIn: "4 days",
      verified: true,
      date: "2024-01-03"
    },
    {
      id: 6,
      name: "Amit Pandey",
      location: "Deoghar, Jharkhand",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 4,
      testimonial: "The traffic signal malfunction was reported and fixed within hours! The emergency response system works excellently. Highly recommend this platform.",
      issueType: "Traffic Management",
      resolvedIn: "6 hours",
      verified: true,
      date: "2024-01-01"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 6000); // Change every 6 seconds
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index);
    setIsAutoPlaying(false);
  };

  const current = testimonials[currentTestimonial];

  return (
    <Box
      sx={{
        py: 8,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
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
            radial-gradient(circle at 25% 25%, rgba(46, 204, 113, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(52, 152, 219, 0.1) 0%, transparent 50%)
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
              fontWeight: 'bold',
              color: '#2c3e50',
              mb: 2,
              animation: `${fadeIn} 1s ease-out`
            }}
          >
            What Citizens Say
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#7f8c8d',
              maxWidth: 600,
              mx: 'auto',
              animation: `${fadeIn} 1s ease-out 0.3s both`
            }}
          >
            Real stories from citizens who have experienced our efficient civic services
          </Typography>
        </Box>

        {/* Main Testimonial Card */}
        <Box sx={{ position: 'relative', mb: 4 }}>
          <Card
            elevation={20}
            sx={{
              maxWidth: 900,
              mx: 'auto',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              overflow: 'visible',
              animation: `${slideIn} 0.8s ease-out`,
              position: 'relative'
            }}
          >
            {/* Quote Icon */}
            <Box
              sx={{
                position: 'absolute',
                top: -20,
                left: 40,
                background: 'linear-gradient(135deg, #3498db, #2980b9)',
                borderRadius: '50%',
                width: 60,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(52, 152, 219, 0.3)',
                animation: `${float} 3s ease-in-out infinite`
              }}
            >
              <FormatQuote sx={{ color: 'white', fontSize: 30 }} />
            </Box>

            <CardContent sx={{ p: 6 }}>
              <Grid container spacing={4} alignItems="center">
                {/* Avatar and User Info */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      src={current.avatar}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 2,
                        border: '4px solid #3498db',
                        boxShadow: '0 8px 25px rgba(52, 152, 219, 0.3)'
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <Typography variant="h5" fontWeight="bold" color="#2c3e50">
                        {current.name}
                      </Typography>
                      {current.verified && (
                        <Verified sx={{ color: '#3498db', ml: 1, fontSize: 20 }} />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      <LocationOn sx={{ color: '#95a5a6', fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2" color="#7f8c8d">
                        {current.location}
                      </Typography>
                    </Box>
                    <Rating value={current.rating} readOnly size="large" />
                  </Box>
                </Grid>

                {/* Testimonial Content */}
                <Grid item xs={12} md={8}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontStyle: 'italic',
                      color: '#34495e',
                      lineHeight: 1.8,
                      mb: 3,
                      fontSize: '1.2rem'
                    }}
                  >
                    "{current.testimonial}"
                  </Typography>

                  {/* Issue Details */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                    <Chip
                      icon={<CheckCircle />}
                      label={`Issue: ${current.issueType}`}
                      sx={{
                        background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                    <Chip
                      label={`Resolved in: ${current.resolvedIn}`}
                      sx={{
                        background: 'linear-gradient(135deg, #f39c12, #e67e22)',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                    <Chip
                      label={new Date(current.date).toLocaleDateString()}
                      sx={{
                        background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Navigation Arrows */}
          <IconButton
            onClick={prevTestimonial}
            sx={{
              position: 'absolute',
              left: -25,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              '&:hover': {
                background: 'white',
                transform: 'translateY(-50%) scale(1.1)',
                boxShadow: '0 12px 35px rgba(0,0,0,0.15)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <ArrowBackIos sx={{ color: '#3498db' }} />
          </IconButton>

          <IconButton
            onClick={nextTestimonial}
            sx={{
              position: 'absolute',
              right: -25,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              '&:hover': {
                background: 'white',
                transform: 'translateY(-50%) scale(1.1)',
                boxShadow: '0 12px 35px rgba(0,0,0,0.15)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <ArrowForwardIos sx={{ color: '#3498db' }} />
          </IconButton>
        </Box>

        {/* Testimonial Indicators */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4 }}>
          {testimonials.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToTestimonial(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: index === currentTestimonial ? '#3498db' : 'rgba(52, 152, 219, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: '#3498db',
                  transform: 'scale(1.3)'
                }
              }}
            />
          ))}
        </Box>

        {/* Summary Statistics */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight="bold" color="#2ecc71">
                98%
              </Typography>
              <Typography variant="body1" color="#7f8c8d">
                Satisfaction Rate
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight="bold" color="#3498db">
                1,247
              </Typography>
              <Typography variant="body1" color="#7f8c8d">
                Issues Resolved
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight="bold" color="#f39c12">
                3.2
              </Typography>
              <Typography variant="body1" color="#7f8c8d">
                Avg Resolution Days
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight="bold" color="#e74c3c">
                15,420
              </Typography>
              <Typography variant="body1" color="#7f8c8d">
                Active Citizens
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CitizenTestimonials;
