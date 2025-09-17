import React, { useState } from 'react';
import {
  Box,
  SpeedDial,
  SpeedDialAction,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar
} from '@mui/material';
import {
  LocalFireDepartment,
  LocalHospital,
  LocalPolice,
  LocalPhone,
  WarningAmber
} from '@mui/icons-material';

const emergencyServices = [
  {
    icon: <LocalFireDepartment sx={{ color: 'white' }} />,
    name: 'Fire Brigade',
    color: '#e74c3c',
    phone: '101'
  },
  {
    icon: <LocalPolice sx={{ color: 'white' }} />,
    name: 'Police',
    color: '#3498db',
    phone: '100'
  },
  {
    icon: <LocalHospital sx={{ color: 'white' }} />,
    name: 'Ambulance',
    color: '#2ecc71',
    phone: '102'
  }
];

export default function EmergencyPanel({ position = { bottom: 30, left: 30 } }) {
  const [openDialog, setOpenDialog] = useState(null);

  const handleOpen = (service) => {
    setOpenDialog(service);
  };

  const handleClose = () => {
    setOpenDialog(null);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        zIndex: 1500,
        ...position
      }}
    >
      {/* Floating Speed Dial */}
      <SpeedDial
        ariaLabel="Emergency quick access"
        icon={<WarningAmber />}
        FabProps={{ sx: { bgcolor: '#e67e22', '&:hover': { bgcolor: '#d35400' } } }}
        direction="up"
      >
        {emergencyServices.map((service) => (
          <SpeedDialAction
            key={service.name}
            icon={
              <Avatar
                sx={{ bgcolor: service.color, width: 36, height: 36 }}
              >
                {service.icon}
              </Avatar>
            }
            tooltipTitle={service.name}
            onClick={() => handleOpen(service)}
          />
        ))}
      </SpeedDial>

      {/* Dialog for selected service */}
      <Dialog open={Boolean(openDialog)} onClose={handleClose}>
        {openDialog && (
          <>
            <DialogTitle>{openDialog.name} Emergency</DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                To contact {openDialog.name.toLowerCase()}, please dial the emergency
                number below or press the call button.
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="primary"
                textAlign="center"
                sx={{ my: 2 }}
              >
                {openDialog.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Note: Location sharing will be enabled to assist quick response.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
              <Button
                variant="contained"
                startIcon={<LocalPhone />}
                href={`tel:${openDialog.phone}`}
              >
                Call Now
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
