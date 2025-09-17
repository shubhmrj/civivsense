import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  LocationOn,
  Schedule,
  CheckCircle,
  Warning,
  SmartToy,
  Speed,
  PieChart,
  BarChart,
  Insights
} from '@mui/icons-material';
import InteractiveCityMap from './InteractiveCityMap';

const AnalyticsPage = ({ user, onLogout }) => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAnalytics = {
        overview: {
          totalReports: 1247,
          resolvedReports: 892,
          pendingReports: 355,
          avgResolutionTime: 4.2,
          resolutionRate: 71.5,
          citizenSatisfaction: 4.3
        },
        trends: {
          reportsThisMonth: 156,
          reportsLastMonth: 134,
          resolutionTimeImprovement: 12.5,
          mlAccuracy: 94.2
        },
        categoryBreakdown: [
          { category: 'Pothole', count: 387, resolved: 278, percentage: 31.0 },
          { category: 'Streetlight', count: 245, resolved: 198, percentage: 19.6 },
          { category: 'Garbage', count: 198, resolved: 156, percentage: 15.9 },
          { category: 'Water Supply', count: 167, resolved: 123, percentage: 13.4 },
          { category: 'Drainage', count: 134, resolved: 89, percentage: 10.7 },
          { category: 'Others', count: 116, resolved: 48, percentage: 9.3 }
        ],
        departmentPerformance: [
          { 
            department: 'Public Works Department', 
            totalReports: 521, 
            resolved: 398, 
            avgTime: 3.8, 
            efficiency: 76.4,
            teams: 8,
            activeOfficers: 24
          },
          { 
            department: 'Electrical Department', 
            totalReports: 298, 
            resolved: 234, 
            avgTime: 2.9, 
            efficiency: 78.5,
            teams: 5,
            activeOfficers: 15
          },
          { 
            department: 'Water Department', 
            totalReports: 234, 
            resolved: 167, 
            avgTime: 5.2, 
            efficiency: 71.4,
            teams: 4,
            activeOfficers: 12
          },
          { 
            department: 'Sanitation Department', 
            totalReports: 194, 
            resolved: 93, 
            avgTime: 6.1, 
            efficiency: 47.9,
            teams: 6,
            activeOfficers: 18
          }
        ],
        hotspots: [
          { area: 'Main Road Junction', reports: 45, severity: 'High' },
          { area: 'Hospital Road', reports: 38, severity: 'Medium' },
          { area: 'Market Area', reports: 34, severity: 'High' },
          { area: 'Railway Station Road', reports: 29, severity: 'Medium' },
          { area: 'College Street', reports: 23, severity: 'Low' }
        ],
        mlInsights: {
          routingAccuracy: 94.2,
          falsePositives: 3.1,
          avgProcessingTime: 0.8,
          costSavings: 2.3,
          predictiveAccuracy: 87.6
        },
        predictions: {
          next7Days: 3.9,
          next30Days: 4.1,
          byDepartment: [
            { dept: 'Public Works', forecast: 3.5, change: -0.3 },
            { dept: 'Electrical', forecast: 2.8, change: -0.1 },
            { dept: 'Water', forecast: 5.0, change: +0.2 },
            { dept: 'Sanitation', forecast: 6.4, change: +0.5 }
          ]
        }
      };

      setAnalytics(mockAnalytics);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 75) return 'success';
    if (efficiency >= 60) return 'warning';
    return 'error';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'High': 'error',
      'Medium': 'warning',
      'Low': 'success'
    };
    return colors[severity] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ textAlign: 'center', mt: 2 }}>Loading analytics...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" gutterBottom>
              Analytics & Insights Dashboard
            </Typography>
            <Typography variant="subtitle1">
              Jharkhand Municipal Corporation • AI-Powered Civic Analytics
            </Typography>
          </Grid>
          <Grid item>
            <FormControl sx={{ minWidth: 120, '& .MuiOutlinedInput-root': { color: 'white' } }}>
              <InputLabel sx={{ color: 'white' }}>Time Range</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
              >
                <MenuItem value="7days">Last 7 Days</MenuItem>
                <MenuItem value="30days">Last 30 Days</MenuItem>
                <MenuItem value="90days">Last 3 Months</MenuItem>
                <MenuItem value="1year">Last Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Key Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assessment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {analytics.overview?.totalReports.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Reports
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                <Typography variant="caption" color="success.main">
                  +{analytics.trends?.reportsThisMonth - analytics.trends?.reportsLastMonth}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {analytics.overview?.resolvedReports.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Resolved
              </Typography>
              <Typography variant="caption" color="success.main">
                {analytics.overview?.resolutionRate}% Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {analytics.overview?.avgResolutionTime}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Days
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <TrendingDown sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                <Typography variant="caption" color="success.main">
                  -{analytics.trends?.resolutionTimeImprovement}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <SmartToy sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {analytics.trends?.mlAccuracy}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ML Accuracy
              </Typography>
              <Typography variant="caption" color="info.main">
                AI Routing
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Speed sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {analytics.overview?.citizenSatisfaction}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Satisfaction
              </Typography>
              <Typography variant="caption" color="secondary.main">
                Out of 5.0
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Warning sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {analytics.overview?.pendingReports.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
              <Typography variant="caption" color="error.main">
                Needs Attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Category Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PieChart sx={{ mr: 1 }} />
                Report Categories
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right">Resolved</TableCell>
                      <TableCell align="right">Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analytics.categoryBreakdown?.map((category) => (
                      <TableRow key={category.category}>
                        <TableCell>{category.category}</TableCell>
                        <TableCell align="right">{category.count}</TableCell>
                        <TableCell align="right">{category.resolved}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={(category.resolved / category.count) * 100}
                              sx={{ width: 60, mr: 1 }}
                            />
                            <Typography variant="caption">
                              {((category.resolved / category.count) * 100).toFixed(0)}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Department Performance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <BarChart sx={{ mr: 1 }} />
                Department Performance
              </Typography>
              {analytics.departmentPerformance?.map((dept) => (
                <Box key={dept.department} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {dept.department}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dept.teams} Teams • {dept.activeOfficers} Officers
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2">
                        {dept.resolved}/{dept.totalReports}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Reports
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Chip
                        label={`${dept.efficiency}%`}
                        color={getEfficiencyColor(dept.efficiency)}
                        size="small"
                      />
                      <Typography variant="caption" display="block" color="text.secondary">
                        {dept.avgTime}d avg
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Problem Hotspots */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1 }} />
                Problem Hotspots Map
              </Typography>
              <InteractiveCityMap height={350} />
            </CardContent>
          </Card>
        </Grid>

        {/* Predictive KPIs */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Insights sx={{ mr: 1 }} />
                Predictive KPIs (AI Forecast)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Forecasted average resolution time (days)
              </Typography>
              {analytics.predictions?.byDepartment.map((p) => (
                <Box key={p.dept} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ minWidth: 150 }}>
                    {p.dept}
                  </Typography>
                  <Chip label={`${p.forecast.toFixed(1)}d`} color={p.change <= 0 ? 'success' : 'error'} size="small" />
                  {p.change !== 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                      {p.change < 0 ? (
                        <TrendingDown sx={{ fontSize: 16, color: 'success.main' }} />
                      ) : (
                        <TrendingUp sx={{ fontSize: 16, color: 'error.main' }} />
                      )}
                      <Typography variant="caption" color={p.change < 0 ? 'success.main' : 'error.main'}>
                        {Math.abs(p.change).toFixed(1)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* ML Insights */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Insights sx={{ mr: 1 }} />
                AI/ML Performance Insights
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="primary.main" fontWeight="bold">
                      {analytics.mlInsights?.routingAccuracy}%
                    </Typography>
                    <Typography variant="caption">Routing Accuracy</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      {analytics.mlInsights?.avgProcessingTime}s
                    </Typography>
                    <Typography variant="caption">Avg Processing</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      {analytics.mlInsights?.falsePositives}%
                    </Typography>
                    <Typography variant="caption">False Positives</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="secondary.main" fontWeight="bold">
                      ₹{analytics.mlInsights?.costSavings}L
                    </Typography>
                    <Typography variant="caption">Cost Savings</Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>AI Recommendation:</strong> Consider increasing team capacity in Sanitation Department 
                  to improve resolution efficiency from 47.9% to target 70%.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsPage;
