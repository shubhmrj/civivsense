// Shared environment configuration for all services
module.exports = {
  development: {
    // Database
    MONGODB_URI: 'mongodb://localhost:27017/civic_reports_dev',
    REDIS_URL: 'redis://localhost:6379',
    
    // API URLs
    WEB_BACKEND_URL: 'http://localhost:5000',
    ML_SERVICES_URL: 'http://localhost:8001',
    BLOCKCHAIN_RPC_URL: 'http://localhost:8545',
    
    // Blockchain
    NETWORK_ID: 1337,
    CONTRACT_ADDRESS: '',
    PRIVATE_KEY: '',
    
    // Storage
    IPFS_API_URL: 'http://localhost:5001',
    AWS_BUCKET_NAME: 'civic-reports-dev',
    
    // External Services
    TWILIO_ACCOUNT_SID: '',
    TWILIO_AUTH_TOKEN: '',
    FIREBASE_SERVER_KEY: '',
    
    // Security
    JWT_SECRET: 'dev-secret-key',
    ENCRYPTION_KEY: 'dev-encryption-key'
  },
  
  production: {
    // Database
    MONGODB_URI: process.env.MONGODB_URI,
    REDIS_URL: process.env.REDIS_URL,
    
    // API URLs
    WEB_BACKEND_URL: process.env.WEB_BACKEND_URL,
    ML_SERVICES_URL: process.env.ML_SERVICES_URL,
    BLOCKCHAIN_RPC_URL: process.env.BLOCKCHAIN_RPC_URL,
    
    // Blockchain
    NETWORK_ID: 137, // Polygon Mainnet
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    
    // Storage
    IPFS_API_URL: process.env.IPFS_API_URL,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    
    // External Services
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    FIREBASE_SERVER_KEY: process.env.FIREBASE_SERVER_KEY,
    
    // Security
    JWT_SECRET: process.env.JWT_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY
  }
};
