import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const DepartmentsPage = ({ user, onLogout }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Department Management
        </Typography>
        <Typography variant="body1">
          This page will show department management interface.
        </Typography>
      </Paper>
    </Box>
  );
};

export default DepartmentsPage;
