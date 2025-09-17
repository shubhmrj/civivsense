import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/civic_reports"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Blockchain
    WEB3_PROVIDER_URL: str = "https://polygon-mumbai.g.alchemy.com/v2/your-api-key"
    PRIVATE_KEY: Optional[str] = None
    CONTRACT_ADDRESS: Optional[str] = None
    
    # IPFS
    IPFS_API_URL: str = "http://localhost:5001"
    
    # AWS S3 (Alternative to IPFS)
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_BUCKET_NAME: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # ML Models
    MODEL_PATH: str = "./models"
    
    # Notification
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    EMAIL_USERNAME: Optional[str] = None
    EMAIL_PASSWORD: Optional[str] = None
    
    class Config:
        env_file = ".env"

settings = Settings()
