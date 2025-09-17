import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Paper,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Chip,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Report,
  Analytics,
  Business,
  Notifications,
  AccountCircle,
  Logout,
  Menu as MenuIcon,
  TrendingUp,
  Warning,
  CheckCircle,
  Schedule,
  LocationOn,
  People
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const Dashboard = ({ user, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API call to get dashboard data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardData({
        stats: {
          totalReports: 156,
          pendingReports: 23,
          resolvedReports: 133,
          activeUsers: 1247,
          avgResolutionTime: 2.3,
          reportsByCategory: {
            pothole: 45,
            streetlight: 32,
            garbage: 28,
            water: 21,
            road: 18,
            drainage: 12
          },
          reportsByStatus: {
            submitted: 12,
            verified: 8,
            assigned: 15,
            in_progress: 18,
            resolved: 103
          }
        },
        recentReports: [
          {
            id: 1,
            title: "Large pothole on Main Street",
            category: "pothole",
            status: "verified",
            priority: 4,
            location: "Main Street, New Delhi",
            createdAt: "2025-09-16T10:15:00Z"
          },
          {
            id: 2,
            title: "Broken streetlight on Park Avenue",
            category: "streetlight",
            status: "assigned",
            priority: 3,
            location: "Park Avenue, New Delhi",
            createdAt: "2025-09-16T09:30:00Z"
          },
          {
            id: 3,
            title: "Overflowing garbage bins",
            category: "garbage",
            status: "in_progress",
            priority: 2,
            location: "Residential Complex, New Delhi",
            createdAt: "2025-09-16T08:45:00Z"
          }
        ],
        departments: [
          { name: "Public Works", efficiency: 85, pending: 8 },
          { name: "Sanitation", efficiency: 92, pending: 5 },
          { name: "Electrical", efficiency: 78, pending: 10 }
        ]
      });
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    toast.success('Logged out successfully');
    onLogout();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Reports', icon: <Report />, path: '/reports' },
    { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
    { text: 'Departments', icon: <Business />, path: '/departments' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      submitted: 'info',
      verified: 'warning',
      assigned: 'primary',
      in_progress: 'secondary',
      resolved: 'success'
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    if (priority >= 4) return 'error';
    if (priority >= 3) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography sx={{ textAlign: 'center', mt: 2 }}>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            SIH Civic Dashboard - Municipal Administration
          </Typography>

          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton
            size="large"
            edge="end"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {user?.name?.charAt(0)}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <AccountCircle sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.text}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          marginLeft: drawerOpen ? 0 : '-240px',
          transition: 'margin-left 0.3s'
        }}
      >
        <Toolbar />
        
        {/* Welcome Section */}
        <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="subtitle1">
            Municipal Corporation Dashboard - Real-time Civic Issue Management
          </Typography>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Report sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Reports
                    </Typography>
                    <Typography variant="h4">
                      {dashboardData?.stats.totalReports}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Schedule sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Pending Reports
                    </Typography>
                    <Typography variant="h4">
                      {dashboardData?.stats.pendingReports}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Resolved Reports
                    </Typography>
                    <Typography variant="h4">
                      {dashboardData?.stats.resolvedReports}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <People sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Active Users
                    </Typography>
                    <Typography variant="h4">
                      {dashboardData?.stats.activeUsers}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Recent Reports */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Reports
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {dashboardData?.recentReports.map((report) => (
                  <Box key={report.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {report.title}
                      </Typography>
                      <Chip
                        label={report.status}
                        color={getStatusColor(report.status)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={report.category}
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label={`Priority: ${report.priority}`}
                        color={getPriorityColor(report.priority)}
                        size="small"
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption">
                          {report.location}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Department Performance */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Department Performance
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {dashboardData?.departments.map((dept, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{dept.name}</Typography>
                      <Typography variant="body2">{dept.efficiency}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={dept.efficiency}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {dept.pending} pending reports
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
