from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, Text, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geometry
from datetime import datetime
import uuid
from .config import settings

# Database setup
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    phone_number = Column(String(15), unique=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=True)
    name = Column(String(255), nullable=True)
    is_verified = Column(Boolean, default=False)
    is_anonymous = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    reports = relationship("Report", back_populates="reporter")

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True)
    description = Column(Text, nullable=True)
    contact_email = Column(String(255))
    contact_phone = Column(String(15))
    is_active = Column(Boolean, default=True)
    
    # Relationships
    reports = relationship("Report", back_populates="assigned_department")
    staff = relationship("Staff", back_populates="department")

class Staff(Base):
    __tablename__ = "staff"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True)
    name = Column(String(255))
    department_id = Column(Integer, ForeignKey("departments.id"))
    role = Column(String(100))  # admin, supervisor, field_worker
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    department = relationship("Department", back_populates="staff")
    assigned_reports = relationship("Report", back_populates="assigned_staff")

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    blockchain_tx_hash = Column(String(66), unique=True, nullable=True)
    
    # Report Details
    title = Column(String(255))
    description = Column(Text)
    category = Column(String(100))  # pothole, garbage, streetlight, etc.
    priority = Column(Integer, default=1)  # 1-5 scale
    severity_score = Column(Float, nullable=True)
    
    # Location
    latitude = Column(Float)
    longitude = Column(Float)
    location = Column(Geometry('POINT'))
    address = Column(Text, nullable=True)
    ward_number = Column(String(50), nullable=True)
    
    # Media
    image_urls = Column(Text, nullable=True)  # JSON array of URLs
    ipfs_hash = Column(String(100), nullable=True)
    
    # Status Tracking
    status = Column(String(50), default="submitted")  # submitted, verified, assigned, in_progress, resolved, closed
    
    # Relationships
    reporter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    assigned_department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    assigned_staff_id = Column(UUID(as_uuid=True), ForeignKey("staff.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)
    assigned_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    
    # AI Analysis
    ai_category_confidence = Column(Float, nullable=True)
    is_duplicate = Column(Boolean, default=False)
    duplicate_of = Column(UUID(as_uuid=True), ForeignKey("reports.id"), nullable=True)
    
    # Relationships
    reporter = relationship("User", back_populates="reports")
    assigned_department = relationship("Department", back_populates="reports")
    assigned_staff = relationship("Staff", back_populates="assigned_reports")
    status_updates = relationship("StatusUpdate", back_populates="report")

class StatusUpdate(Base):
    __tablename__ = "status_updates"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(UUID(as_uuid=True), ForeignKey("reports.id"))
    old_status = Column(String(50))
    new_status = Column(String(50))
    comment = Column(Text, nullable=True)
    updated_by = Column(UUID(as_uuid=True), nullable=True)  # staff ID
    created_at = Column(DateTime, default=datetime.utcnow)
    blockchain_tx_hash = Column(String(66), nullable=True)
    
    # Relationships
    report = relationship("Report", back_populates="status_updates")

# Database dependency
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)
