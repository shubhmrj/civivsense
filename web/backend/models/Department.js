const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true
  },
  
  // Contact Information
  contactEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true
  },
  
  // Categories this department handles
  categories: [{
    type: String,
    enum: ['pothole', 'garbage', 'streetlight', 'water', 'road', 'drainage', 'other']
  }],
  
  // Geographic coverage
  coverageAreas: [{
    wardNumber: String,
    areaName: String,
    boundaries: {
      type: {
        type: String,
        enum: ['Polygon'],
        default: 'Polygon'
      },
      coordinates: [[[Number]]] // GeoJSON Polygon
    }
  }],
  
  // Department head
  headOfDepartment: {
    name: String,
    email: String,
    phone: String
  },
  
  // Performance metrics
  metrics: {
    totalAssigned: {
      type: Number,
      default: 0
    },
    totalResolved: {
      type: Number,
      default: 0
    },
    avgResolutionTime: {
      type: Number,
      default: 0
    },
    currentPending: {
      type: Number,
      default: 0
    }
  },
  
  // SLA (Service Level Agreement)
  sla: {
    responseTimeHours: {
      type: Number,
      default: 24
    },
    resolutionTimeHours: {
      type: Number,
      default: 72
    }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Working hours
  workingHours: {
    monday: { start: String, end: String },
    tuesday: { start: String, end: String },
    wednesday: { start: String, end: String },
    thursday: { start: String, end: String },
    friday: { start: String, end: String },
    saturday: { start: String, end: String },
    sunday: { start: String, end: String }
  }
}, {
  timestamps: true
});

// Indexes
departmentSchema.index({ name: 1 });
departmentSchema.index({ categories: 1 });
departmentSchema.index({ isActive: 1 });

// Method to check if department handles a category
departmentSchema.methods.handlesCategory = function(category) {
  return this.categories.includes(category);
};

// Method to update metrics
departmentSchema.methods.updateMetrics = function(action) {
  switch(action) {
    case 'assigned':
      this.metrics.totalAssigned += 1;
      this.metrics.currentPending += 1;
      break;
    case 'resolved':
      this.metrics.totalResolved += 1;
      this.metrics.currentPending -= 1;
      break;
  }
};

module.exports = mongoose.model('Department', departmentSchema);
