const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // Authentication
  password: {
    type: String,
    minlength: 6
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationExpires: Date,
  
  // User Type
  userType: {
    type: String,
    enum: ['citizen', 'staff', 'admin'],
    default: 'citizen'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  
  // Profile
  avatar: {
    url: String,
    filename: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  
  // Preferences
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    }
  },
  
  // Activity Tracking
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Reputation System
  reputationScore: {
    type: Number,
    default: 0
  },
  totalReports: {
    type: Number,
    default: 0
  },
  resolvedReports: {
    type: Number,
    default: 0
  },
  
  // Device Information
  deviceTokens: [String], // For push notifications
  
  // Reset Password
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Indexes
userSchema.index({ phoneNumber: 1 });
userSchema.index({ email: 1 });
userSchema.index({ userType: 1, isActive: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate verification token
userSchema.methods.generateVerificationToken = function() {
  this.verificationToken = Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15);
  this.verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return this.verificationToken;
};

// Update reputation score
userSchema.methods.updateReputation = function(points) {
  this.reputationScore += points;
  if (this.reputationScore < 0) this.reputationScore = 0;
};

module.exports = mongoose.model('User', userSchema);
