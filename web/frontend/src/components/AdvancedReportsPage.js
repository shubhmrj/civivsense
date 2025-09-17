import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Tooltip,
  Paper,
  Divider,
  Avatar,
  LinearProgress,
  Alert,
  Checkbox,
  Toolbar
} from '@mui/material';
import {
  FilterList,
  Search,
  Add,
  Edit,
  Visibility,
  Assignment,
  LocationOn,
  Schedule,
  Priority,
  SmartToy,
  Map,
  Download,
  Refresh,
  CheckCircle
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const AdvancedReportsPage = ({ user, onLogout }) => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    assignedTo: '',
    dateRange: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, filters, searchTerm]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReports = [
        {
          id: 1,
          title: "Large pothole on Main Road causing traffic issues",
          description: "Deep pothole near City Mall intersection affecting vehicle movement",
          category: "pothole",
          status: "verified",
          priority: 5,
          urgency: "Critical",
          location: "Main Road, Ranchi",
          coordinates: { lat: 23.3441, lng: 85.3096 },
          reporter: "Citizen - Rajesh Kumar",
          reporterPhone: "+91-9876543210",
          createdAt: "2025-09-16T10:15:00Z",
          assignedTo: user.role === 'field_officer' ? user.name : "Ravi Kumar",
          assignedDepartment: "Public Works Department",
          images: ["pothole1.jpg", "pothole2.jpg"],
          aiAnalysis: {
            confidence: 0.95,
            detectedObjects: ["pothole", "road_damage"],
            severity: "high",
            estimatedCost: 15000
          },
          mlRouting: {
            suggestedDepartment: "Public Works Department",
            confidence: 0.92,
            reasoning: "Image analysis detected road infrastructure damage"
          }
        },
        {
          id: 2,
          title: "Broken streetlight creating safety concerns",
          description: "Streetlight not working for 3 days, creating safety issues for pedestrians",
          category: "streetlight",
          status: "assigned",
          priority: 4,
          urgency: "High",
          location: "Hospital Road, Ranchi",
          coordinates: { lat: 23.3629, lng: 85.3371 },
          reporter: "Dr. Priya Sharma",
          reporterPhone: "+91-9876543211",
          createdAt: "2025-09-16T09:30:00Z",
          assignedTo: "Electrical Team A",
          assignedDepartment: "Electrical Department",
          images: ["streetlight1.jpg"],
          aiAnalysis: {
            confidence: 0.88,
            detectedObjects: ["streetlight", "electrical_equipment"],
            severity: "medium",
            estimatedCost: 5000
          },
          mlRouting: {
            suggestedDepartment: "Electrical Department",
            confidence: 0.89,
            reasoning: "Text analysis and image recognition identified electrical infrastructure issue"
          }
        }
      ];

      // Filter based on user role
      let userReports = mockReports;
      if (user.role === 'field_officer') {
        userReports = mockReports.filter(report => 
          report.assignedTo === user.name || report.status === 'assigned'
        );
      } else if (user.role === 'department_head') {
        userReports = mockReports.filter(report => 
          report.assignedDepartment === user.department
        );
      }

      setReports(userReports);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load reports');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = reports;

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(report => report.status === filters.status);
    }
    if (filters.category) {
      filtered = filtered.filter(report => report.category === filters.category);
    }
    if (filters.priority) {
      filtered = filtered.filter(report => report.priority >= parseInt(filters.priority));
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reporter.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setDetailsOpen(true);
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

  // Handle checkbox selection
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(filteredReports.map((rep) => rep.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const bulkMarkResolved = () => {
    if (selectedIds.length === 0) return;
    // Update local state (mock)
    const updated = reports.map((r) =>
      selectedIds.includes(r.id) ? { ...r, status: 'resolved' } : r
    );
    setReports(updated);
    setSelectedIds([]);
    toast.success(`Marked ${selectedIds.length} reports resolved`);
  };

  const exportCSV = () => {
    const rows = filteredReports.map(({ id, title, category, status, priority, location }) => ({
      id,
      title,
      category,
      status,
      priority,
      location
    }));
    const header = Object.keys(rows[0] || {}).join(',');
    const csv =
      header +
      '\n' +
      rows.map((r) => Object.values(r).map((v) => `"${String(v).replace('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'reports.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ textAlign: 'center', mt: 2 }}>Loading reports...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          {user.role === 'field_officer' ? 'My Assigned Reports' : 'Reports Management'}
        </Typography>
        <Typography variant="subtitle1">
          Jharkhand Municipal Corporation • AI-Powered Civic Issue Tracking
        </Typography>
      </Paper>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search Reports"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="submitted">Submitted</MenuItem>
                  <MenuItem value="verified">Verified</MenuItem>
                  <MenuItem value="assigned">Assigned</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pothole">Pothole</MenuItem>
                  <MenuItem value="streetlight">Streetlight</MenuItem>
                  <MenuItem value="garbage">Garbage</MenuItem>
                  <MenuItem value="water">Water</MenuItem>
                  <MenuItem value="drainage">Drainage</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Min Priority</InputLabel>
                <Select
                  value={filters.priority}
                  onChange={(e) => setFilters({...filters, priority: e.target.value})}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="3">3+</MenuItem>
                  <MenuItem value="4">4+</MenuItem>
                  <MenuItem value="5">5 (Critical)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchReports}
                >
                  Refresh
                </Button>
                <Button variant="outlined" startIcon={<Download />} onClick={exportCSV}>
                  Export CSV
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Reports ({filteredReports.length})
            </Typography>
            {user.role === 'admin' && (
              <Button variant="contained" startIcon={<Add />}>
                Add Report
              </Button>
            )}
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedIds.length>0 && selectedIds.length<filteredReports.length}
                      checked={filteredReports.length>0 && selectedIds.length===filteredReports.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Report Details</TableCell>
                  <TableCell>Status & Priority</TableCell>
                  <TableCell>AI Analysis</TableCell>
                  <TableCell>Assignment</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} hover selected={selectedIds.includes(report.id)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(report.id)}
                        onChange={() => handleSelect(report.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {report.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {report.category} • {report.reporter}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <LocationOn sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption">
                            {report.location}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Chip
                          label={report.status.replace('_', ' ')}
                          color={getStatusColor(report.status)}
                          size="small"
                        />
                        <Chip
                          label={`Priority ${report.priority}`}
                          color={getPriorityColor(report.priority)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SmartToy sx={{ color: 'primary.main' }} />
                        <Box>
                          <Typography variant="caption" display="block">
                            Confidence: {(report.aiAnalysis.confidence * 100).toFixed(0)}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Cost: ₹{report.aiAnalysis.estimatedCost.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="caption" display="block" fontWeight="bold">
                          {report.assignedDepartment}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {report.assignedTo || 'Unassigned'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            onClick={() => handleViewDetails(report)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        {user.role !== 'field_officer' && (
                          <Tooltip title="Assign">
                            <IconButton size="small">
                              <Assignment />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {selectedIds.length>0 && (
            <Toolbar sx={{ mt:2, background:'#f1f8e9', borderRadius:1 }}>
              <Typography sx={{ flex:1 }} variant="body2">{selectedIds.length} selected</Typography>
              <Button startIcon={<CheckCircle />} variant="contained" color="success" onClick={bulkMarkResolved}>
                Mark Resolved
              </Button>
            </Toolbar>
          )}
        </CardContent>
      </Card>

      {/* Report Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Report Details - {selectedReport?.title}
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Basic Information</Typography>
                <Typography><strong>Category:</strong> {selectedReport.category}</Typography>
                <Typography><strong>Status:</strong> {selectedReport.status}</Typography>
                <Typography><strong>Priority:</strong> {selectedReport.priority}/5</Typography>
                <Typography><strong>Location:</strong> {selectedReport.location}</Typography>
                <Typography><strong>Reporter:</strong> {selectedReport.reporter}</Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>AI Analysis</Typography>
                <Alert severity="info" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    <strong>ML Routing:</strong> {selectedReport.mlRouting.suggestedDepartment} 
                    ({(selectedReport.mlRouting.confidence * 100).toFixed(0)}% confidence)
                  </Typography>
                  <Typography variant="caption">
                    {selectedReport.mlRouting.reasoning}
                  </Typography>
                </Alert>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Assignment Details</Typography>
                <Typography><strong>Department:</strong> {selectedReport.assignedDepartment}</Typography>
                <Typography><strong>Assigned To:</strong> {selectedReport.assignedTo || 'Unassigned'}</Typography>
                <Typography><strong>Estimated Cost:</strong> ₹{selectedReport.aiAnalysis.estimatedCost.toLocaleString()}</Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Description</Typography>
                <Typography variant="body2">
                  {selectedReport.description}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          {user.role !== 'field_officer' && (
            <Button variant="contained">Assign Team</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvancedReportsPage;
