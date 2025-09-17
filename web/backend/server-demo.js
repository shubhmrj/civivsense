const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// In-memory data store for demo
let reports = [];
let users = [];
let departments = [
  {
    id: 1,
    name: 'Public Works Department',
    categories: ['pothole', 'road'],
    contactEmail: 'pwd@city.gov',
    contactPhone: '+91-9876543210'
  },
  {
    id: 2,
    name: 'Sanitation Department',
    categories: ['garbage'],
    contactEmail: 'sanitation@city.gov',
    contactPhone: '+91-9876543211'
  },
  {
    id: 3,
    name: 'Electrical Department',
    categories: ['streetlight'],
    contactEmail: 'electrical@city.gov',
    contactPhone: '+91-9876543212'
  }
];

// Demo API Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SIH Civic Reporting Backend is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      database: 'In-Memory (Demo)',
      ml_services: 'Ready',
      blockchain: 'Ready'
    }
  });
});

// Get all reports
app.get('/api/reports', (req, res) => {
  const { category, status, limit = 10 } = req.query;
  
  let filteredReports = reports;
  
  if (category) {
    filteredReports = filteredReports.filter(r => r.category === category);
  }
  
  if (status) {
    filteredReports = filteredReports.filter(r => r.status === status);
  }
  
  const limitedReports = filteredReports.slice(0, parseInt(limit));
  
  res.json({
    reports: limitedReports,
    total: filteredReports.length,
    message: `Found ${filteredReports.length} reports`
  });
});

// Create new report
app.post('/api/reports', (req, res) => {
  const {
    title,
    description,
    category,
    latitude,
    longitude,
    address,
    isAnonymous = false
  } = req.body;

  if (!title || !description || !category || !latitude || !longitude) {
    return res.status(400).json({ 
      message: 'Missing required fields: title, description, category, latitude, longitude' 
    });
  }

  const newReport = {
    id: reports.length + 1,
    title,
    description,
    category,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    address,
    status: 'submitted',
    priority: Math.floor(Math.random() * 5) + 1, // Random priority 1-5
    isAnonymous,
    createdAt: new Date().toISOString(),
    viewCount: 0,
    upvotes: 0,
    // AI Analysis simulation
    aiAnalysis: {
      categoryConfidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      isDuplicate: Math.random() < 0.1, // 10% chance of duplicate
      severityScore: Math.random()
    }
  };

  reports.push(newReport);

  res.status(201).json({
    message: 'Report created successfully!',
    report: newReport,
    nextSteps: [
      'AI analysis completed',
      'Report will be assigned to appropriate department',
      'You will receive updates via notifications'
    ]
  });
});

// Get single report
app.get('/api/reports/:id', (req, res) => {
  const reportId = parseInt(req.params.id);
  const report = reports.find(r => r.id === reportId);
  
  if (!report) {
    return res.status(404).json({ message: 'Report not found' });
  }

  // Increment view count
  report.viewCount += 1;

  res.json({ 
    report,
    department: departments.find(d => d.categories.includes(report.category))
  });
});

// Update report status
app.put('/api/reports/:id/status', (req, res) => {
  const reportId = parseInt(req.params.id);
  const { status } = req.body;
  
  const report = reports.find(r => r.id === reportId);
  
  if (!report) {
    return res.status(404).json({ message: 'Report not found' });
  }

  const oldStatus = report.status;
  report.status = status;

  // Update timestamps
  if (status === 'verified') {
    report.verifiedAt = new Date().toISOString();
  } else if (status === 'assigned') {
    report.assignedAt = new Date().toISOString();
  } else if (status === 'resolved') {
    report.resolvedAt = new Date().toISOString();
  }

  res.json({
    message: `Report status updated from ${oldStatus} to ${status}`,
    report,
    blockchainTx: '0x' + Math.random().toString(16).substr(2, 64) // Mock blockchain hash
  });
});

// Get departments
app.get('/api/departments', (req, res) => {
  res.json({ 
    departments,
    message: 'Available departments for report assignment'
  });
});

// Analytics endpoint
app.get('/api/analytics', (req, res) => {
  const totalReports = reports.length;
  const pendingReports = reports.filter(r => ['submitted', 'verified', 'assigned'].includes(r.status)).length;
  const resolvedReports = reports.filter(r => r.status === 'resolved').length;

  const reportsByCategory = {};
  const reportsByStatus = {};

  reports.forEach(report => {
    reportsByCategory[report.category] = (reportsByCategory[report.category] || 0) + 1;
    reportsByStatus[report.status] = (reportsByStatus[report.status] || 0) + 1;
  });

  res.json({
    stats: {
      totalReports,
      pendingReports,
      resolvedReports,
      reportsByCategory,
      reportsByStatus
    },
    recentReports: reports.slice(-5).reverse(),
    message: 'Analytics data for civic reporting dashboard'
  });
});

// Simulate ML analysis endpoint
app.post('/api/analyze/report', (req, res) => {
  const { title, description, category } = req.body;
  
  // Simulate AI processing
  setTimeout(() => {
    res.json({
      analysis: {
        detectedCategory: category,
        confidence: Math.random() * 0.3 + 0.7,
        priority: Math.floor(Math.random() * 5) + 1,
        sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
        urgencyKeywords: ['urgent', 'immediate', 'emergency'].filter(() => Math.random() < 0.3),
        isDuplicate: Math.random() < 0.1
      },
      message: 'AI analysis completed successfully'
    });
  }, 1000); // Simulate processing time
});

// Blockchain verification endpoint
app.get('/api/blockchain/verify/:reportId', (req, res) => {
  const reportId = req.params.reportId;
  
  res.json({
    verified: true,
    blockchainHash: '0x' + Math.random().toString(16).substr(2, 64),
    timestamp: new Date().toISOString(),
    network: 'Polygon Mumbai Testnet',
    gasUsed: Math.floor(Math.random() * 50000) + 21000,
    message: 'Report successfully verified on blockchain'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    availableEndpoints: [
      'GET /health',
      'GET /api/reports',
      'POST /api/reports',
      'GET /api/reports/:id',
      'PUT /api/reports/:id/status',
      'GET /api/departments',
      'GET /api/analytics',
      'POST /api/analyze/report',
      'GET /api/blockchain/verify/:reportId'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SIH Civic Reporting Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📱 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🎯 Ready to receive civic issue reports!`);
});
