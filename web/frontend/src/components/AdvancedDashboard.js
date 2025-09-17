import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
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
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fab,
  Tooltip,
  Alert
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
  People,
  Assignment,
  Add,
  Edit,
  Visibility,
  Map,
  Speed,
  Security,
  Group,
  Settings,
  Phone,
  Email,
  Flag
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import socket from '../socket';

const AdvancedDashboard = ({ user, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    if (user.role === 'department_head') {
      fetchTeamMembers();
    }
  }, [user.role]);

  // Socket.IO real-time notifications
  useEffect(() => {
    // Avoid multiple listeners in hot-reload
    socket.off('report:new');
    socket.off('report:status');

    socket.on('report:new', (report) => {
      toast.info(`🆕 New report: ${report.title}`);
    });

    socket.on('report:status', ({ id, status }) => {
      const statusLabel = status.replace('_', ' ');
      toast.success(`✅ Report #${id} updated to ${statusLabel}`);
    });

    return () => {
      socket.off('report:new');
      socket.off('report:status');
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Role-based data
      const baseData = {
        stats: {
          totalReports: 234,
          pendingReports: 45,
          resolvedReports: 189,
          activeUsers: 2847,
          avgResolutionTime: 1.8,
          reportsByCategory: {
            pothole: 67,
            streetlight: 45,
            garbage: 38,
            water: 32,
            road: 28,
            drainage: 24
          },
          reportsByStatus: {
            submitted: 18,
            verified: 12,
            assigned: 25,
            in_progress: 32,
            resolved: 147
          }
        },
        recentReports: [
          {
            id: 1,
            title: "Large pothole on Main Road",
            category: "pothole",
            status: user.role === 'field_officer' ? "assigned" : "verified",
            priority: 5,
            location: "Main Road, Ranchi",
            createdAt: "2025-09-16T10:15:00Z",
            assignedTo: user.role === 'field_officer' ? user.name : null,
            reporter: "Citizen - Anonymous",
            urgency: "High"
          },
          {
            id: 2,
            title: "Broken streetlight near Hospital",
            category: "streetlight",
            status: "in_progress",
            priority: 4,
            location: "Hospital Road, Ranchi",
            createdAt: "2025-09-16T09:30:00Z",
            assignedTo: "Electrical Team A",
            reporter: "Dr. Sharma",
            urgency: "Medium"
          },
          {
            id: 3,
            title: "Overflowing drainage system",
            category: "drainage",
            status: "submitted",
            priority: 5,
            location: "Residential Area, Sector 2",
            createdAt: "2025-09-16T08:45:00Z",
            assignedTo: null,
            reporter: "Resident Association",
            urgency: "Critical"
          }
        ],
        departments: [
          { name: "Public Works", efficiency: 92, pending: 15, head: "Rajesh Kumar" },
          { name: "Sanitation", efficiency: 88, pending: 8, head: "Priya Singh" },
          { name: "Electrical", efficiency: 85, pending: 12, head: "Amit Gupta" },
          { name: "Water Supply", efficiency: 90, pending: 10, head: "Sunita Devi" }
        ]
      };

      // Adjust data based on user role
      if (user.role === 'field_officer') {
        baseData.recentReports = baseData.recentReports.filter(report => 
          report.assignedTo === user.name || report.status === 'assigned'
        );
        baseData.stats.totalReports = 23;
        baseData.stats.pendingReports = 8;
      } else if (user.role === 'department_head') {
        baseData.recentReports = baseData.recentReports.filter(report => 
          report.category === 'pothole' || report.category === 'road'
        );
        baseData.stats.totalReports = 89;
        baseData.stats.pendingReports = 15;
      }

      setDashboardData(baseData);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    // Simulate fetching team members for department head
    await new Promise(resolve => setTimeout(resolve, 500));
    setTeamMembers([
      { id: 1, name: "Ravi Kumar", role: "Senior Engineer", status: "Available", workload: 3 },
      { id: 2, name: "Anjali Sharma", role: "Field Inspector", status: "On Field", workload: 5 },
      { id: 3, name: "Suresh Gupta", role: "Technical Officer", status: "Available", workload: 2 },
      { id: 4, name: "Meera Devi", role: "Junior Engineer", status: "Available", workload: 4 }
    ]);
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

  const handleAssignReport = (report) => {
    setSelectedReport(report);
    setAssignDialogOpen(true);
  };

  const handleAssignToTeam = (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (member && selectedReport) {
      toast.success(`Report "${selectedReport.title}" assigned to ${member.name}`);
      setAssignDialogOpen(false);
      setSelectedReport(null);
      // Update the report status
      const updatedReports = dashboardData.recentReports.map(report => 
        report.id === selectedReport.id 
          ? { ...report, status: 'assigned', assignedTo: member.name }
          : report
      );
      setDashboardData({
        ...dashboardData,
        recentReports: updatedReports
      });
    }
  };

  const getMenuItems = () => {
    const baseItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/', roles: ['admin', 'department_head', 'field_officer'] },
      { text: 'Reports', icon: <Report />, path: '/reports', roles: ['admin', 'department_head', 'field_officer'] },
      { text: 'Analytics', icon: <Analytics />, path: '/analytics', roles: ['admin', 'department_head'] },
      { text: 'Departments', icon: <Business />, path: '/departments', roles: ['admin'] },
      { text: 'Team Management', icon: <Group />, path: '/team', roles: ['department_head'] },
      { text: 'Field Operations', icon: <Map />, path: '/field', roles: ['field_officer'] },
      { text: 'Settings', icon: <Settings />, path: '/settings', roles: ['admin', 'department_head'] },
      { text: 'Audit Logs', icon: <Security />, path: '/audit', roles: ['admin'] }
    ];

    return baseItems.filter(item => item.roles.includes(user.role));
  };

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

  const getUrgencyColor = (urgency) => {
    const colors = {
      'Critical': 'error',
      'High': 'warning',
      'Medium': 'info',
      'Low': 'success'
    };
    return colors[urgency] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography sx={{ textAlign: 'center', mt: 2 }}>Loading Jharkhand Municipal Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Flag sx={{ mr: 1 }} />
            <Typography variant="h6" noWrap component="div">
              Jharkhand Municipal Corporation - {user.department}
            </Typography>
          </Box>

          <Chip 
            label={user.role.replace('_', ' ').toUpperCase()} 
            color="secondary" 
            size="small" 
            sx={{ mr: 2, fontWeight: 'bold' }}
          />

          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={user.role === 'field_officer' ? 2 : 6} color="error">
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
              Profile Settings
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>
              <Phone sx={{ mr: 1 }} />
              Emergency Contacts
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
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)'
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 1 }}>
          {/* User Info Card */}
          <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  {user.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {user.name}
                  </Typography>
                  <Typography variant="caption">
                    {user.city} • {user.role.replace('_', ' ')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <List>
            {getMenuItems().map((item) => (
              <ListItemButton 
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{ 
                  borderRadius: 2, 
                  mb: 0.5,
                  '&:hover': { 
                    bgcolor: 'primary.light',
                    color: 'white',
                    '& .MuiListItemIcon-root': { color: 'white' }
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
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
          marginLeft: drawerOpen ? 0 : '-280px',
          transition: 'margin-left 0.3s'
        }}
      >
        <Toolbar />
        
        {/* Welcome Section */}
        <Paper sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white',
          borderRadius: 3
        }}>
          <Grid container alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Welcome back, {user?.name}!
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Jharkhand Municipal Corporation • {user.city} • Real-time Civic Issue Management
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                Role: {user.role.replace('_', ' ').toUpperCase()} | Department: {user.department}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Last Login: Today, 9:30 AM
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  System Status: All Services Online
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Report sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {user.role === 'field_officer' ? 'Assigned Reports' : 'Total Reports'}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {dashboardData?.stats.totalReports}
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      +12% from last month
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Schedule sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Pending Reports
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {dashboardData?.stats.pendingReports}
                    </Typography>
                    <Typography variant="caption" color="warning.main">
                      Needs attention
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Resolved Reports
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {dashboardData?.stats.resolvedReports}
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      +8% efficiency
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Speed sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Avg Resolution Time
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {dashboardData?.stats.avgResolutionTime}d
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      -15% faster
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
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {user.role === 'field_officer' ? 'My Assigned Reports' : 'Recent Reports'}
                  </Typography>
                  {user.role === 'admin' && (
                    <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/reports')}>
                      Add Report
                    </Button>
                  )}
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Report</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Location</TableCell>
                        {user.role === 'department_head' && <TableCell>Actions</TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData?.recentReports.map((report) => (
                        <TableRow key={report.id} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {report.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {report.category} • {report.reporter}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={report.status.replace('_', ' ')}
                              color={getStatusColor(report.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={`P${report.priority}`}
                                color={getPriorityColor(report.priority)}
                                size="small"
                              />
                              <Chip
                                label={report.urgency}
                                color={getUrgencyColor(report.urgency)}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption">
                                {report.location}
                              </Typography>
                            </Box>
                          </TableCell>
                          {user.role === 'department_head' && (
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Assign to Team">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleAssignReport(report)}
                                    disabled={report.status === 'resolved'}
                                  >
                                    <Assignment />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="View Details">
                                  <IconButton size="small">
                                    <Visibility />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Department Performance / Team Status */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {user.role === 'department_head' ? 'Team Status' : 'Department Performance'}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {user.role === 'department_head' ? (
                  // Team members for department head
                  <Box>
                    {teamMembers.map((member) => (
                      <Box key={member.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {member.name}
                          </Typography>
                          <Chip 
                            label={member.status} 
                            color={member.status === 'Available' ? 'success' : 'warning'}
                            size="small"
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {member.role}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="caption" sx={{ mr: 1 }}>
                            Workload: {member.workload}/10
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={member.workload * 10}
                            sx={{ flexGrow: 1, height: 4, borderRadius: 2 }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  // Department performance for admin/field officer
                  <Box>
                    {dashboardData?.departments.map((dept, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" fontWeight="bold">{dept.name}</Typography>
                          <Typography variant="body2">{dept.efficiency}%</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={dept.efficiency}
                          sx={{ mb: 1, height: 6, borderRadius: 3 }}
                          color={dept.efficiency >= 90 ? 'success' : dept.efficiency >= 80 ? 'primary' : 'warning'}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            Head: {dept.head}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dept.pending} pending
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions for Field Officer */}
        {user.role === 'field_officer' && (
          <Box sx={{ position: 'fixed', bottom: 24, right: 24 }}>
            <Tooltip title="Update Report Status">
              <Fab color="primary" sx={{ mr: 1 }}>
                <Edit />
              </Fab>
            </Tooltip>
            <Tooltip title="Emergency Report">
              <Fab color="error">
                <Warning />
              </Fab>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* Team Assignment Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Report to Team Member</DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box sx={{ mb: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="subtitle2">{selectedReport.title}</Typography>
                <Typography variant="caption">{selectedReport.location}</Typography>
              </Alert>
            </Box>
          )}
          
          <Typography variant="subtitle2" gutterBottom>
            Available Team Members:
          </Typography>
          
          <Grid container spacing={2}>
            {teamMembers.filter(member => member.status === 'Available').map((member) => (
              <Grid item xs={12} key={member.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'primary.light', color: 'white' }
                  }}
                  onClick={() => handleAssignToTeam(member.id)}
                >
                  <CardContent sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle2">{member.name}</Typography>
                        <Typography variant="caption">{member.role}</Typography>
                      </Box>
                      <Typography variant="caption">
                        Workload: {member.workload}/10
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvancedDashboard;
