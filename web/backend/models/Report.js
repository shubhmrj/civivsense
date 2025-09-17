const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  // Basic Report Information
  title: {
    type: String,
    required: true,
    maxlength: 255,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['pothole', 'garbage', 'streetlight', 'water', 'road', 'drainage', 'other']
  },
  
  // Location Data
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  address: {
    type: String,
    trim: true
  },
  wardNumber: {
    type: String,
    trim: true
  },
  
  // Media Files
  images: [{
    url: String,
    ipfsHash: String,
    filename: String,
    size: Number
  }],
  
  // Status and Priority
  status: {
    type: String,
    enum: ['submitted', 'verified', 'assigned', 'in_progress', 'resolved', 'closed'],
    default: 'submitted'
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  severityScore: {
    type: Number,
    min: 0,
    max: 1
  },
  
  // AI Analysis
  aiAnalysis: {
    categoryConfidence: Number,
    isDuplicate: {
      type: Boolean,
      default: false
    },
    duplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report'
    },
    detectedObjects: [String],
    textSentiment: String
  },
  
  // Assignment
  assignedDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  
  // Reporter Information
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  
  // Blockchain
  blockchainTxHash: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Timestamps
  verifiedAt: Date,
  assignedAt: Date,
  resolvedAt: Date,
  
  // Resolution
  resolutionImages: [{
    url: String,
    filename: String
  }],
  resolutionComment: String,
  
  // Metadata
  viewCount: {
    type: Number,
    default: 0
  },
  upvotes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Geospatial index for location-based queries
reportSchema.index({ location: '2dsphere' });

// Text index for search functionality
reportSchema.index({ 
  title: 'text', 
  description: 'text', 
  address: 'text' 
});

// Compound indexes for common queries
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ category: 1, priority: -1 });
reportSchema.index({ assignedDepartment: 1, status: 1 });

// Virtual for getting latitude/longitude
reportSchema.virtual('latitude').get(function() {
  return this.location.coordinates[1];
});

reportSchema.virtual('longitude').get(function() {
  return this.location.coordinates[0];
});

// Method to calculate distance from a point
reportSchema.methods.distanceFrom = function(lat, lng) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat - this.latitude) * Math.PI / 180;
  const dLng = (lng - this.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.latitude * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Static method to find nearby reports
reportSchema.statics.findNearby = function(lat, lng, radiusKm = 1) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: radiusKm * 1000 // Convert km to meters
      }
    }
  });
};

module.exports = mongoose.model('Report', reportSchema);
