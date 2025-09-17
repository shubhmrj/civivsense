import React, { useEffect, useRef } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { keyframes } from '@mui/system';

// Keyframes for marquee animation
const marquee = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

// Sample news data – replace with API integration later
const newsItems = [
  {
    id: 1,
    title: 'Mayor announces new digital governance initiative',
    date: '2025-09-15',
  },
  {
    id: 2,
    title: 'Smart traffic lights installed in key intersections across Ranchi',
    date: '2025-09-14',
  },
  {
    id: 3,
    title: 'Jharkhand Municipal Corporation wins “Best Digital Initiative” award',
    date: '2025-09-10',
  },
  {
    id: 4,
    title: 'Public grievance redressal time reduced to 48 hours on average',
    date: '2025-09-09',
  },
  {
    id: 5,
    title: 'Green parks rejuvenation drive begins in all wards',
    date: '2025-09-05',
  },
];

export default function NewsTicker() {
  const tickerRef = useRef(null);

  // Duplicate the items so the scroll looks continuous
  const scrollingItems = [...newsItems, ...newsItems];

  useEffect(() => {
    // Pause animation on hover
    const tickerEl = tickerRef.current;
    if (!tickerEl) return;

    const handleMouseEnter = () => {
      tickerEl.style.animationPlayState = 'paused';
    };
    const handleMouseLeave = () => {
      tickerEl.style.animationPlayState = 'running';
    };

    tickerEl.addEventListener('mouseenter', handleMouseEnter);
    tickerEl.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      tickerEl.removeEventListener('mouseenter', handleMouseEnter);
      tickerEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Box sx={{ py: 4, background: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)', overflow: 'hidden' }}>
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mr: 4 }}>
          Latest Announcements:
        </Typography>
        <Box
          ref={tickerRef}
          sx={{
            display: 'flex',
            whiteSpace: 'nowrap',
            animation: `${marquee} 30s linear infinite`,
            gap: 6,
          }}
        >
          {scrollingItems.map((news) => (
            <Typography
              key={news.id + Math.random()}
              variant="body1"
              sx={{ color: 'white', mr: 6, fontWeight: 500 }}
            >
              {new Date(news.date).toLocaleDateString()} – {news.title}
            </Typography>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
