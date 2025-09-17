from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# User Schemas
class UserCreate(BaseModel):
    phone_number: str = Field(..., regex=r'^\+?1?\d{9,15}$')
    email: Optional[str] = None
    name: Optional[str] = None
    is_anonymous: bool = False

class UserResponse(BaseModel):
    id: UUID
    phone_number: str
    email: Optional[str]
    name: Optional[str]
    is_verified: bool
    is_anonymous: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Report Schemas
class ReportCreate(BaseModel):
    title: str = Field(..., max_length=255)
    description: str
    category: str = Field(..., regex=r'^(pothole|garbage|streetlight|water|road|other)$')
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    address: Optional[str] = None
    ward_number: Optional[str] = None
    image_urls: Optional[List[str]] = None
    is_anonymous: bool = False

class ReportResponse(BaseModel):
    id: UUID
    blockchain_tx_hash: Optional[str]
    title: str
    description: str
    category: str
    priority: int
    severity_score: Optional[float]
    latitude: float
    longitude: float
    address: Optional[str]
    ward_number: Optional[str]
    image_urls: Optional[List[str]]
    ipfs_hash: Optional[str]
    status: str
    ai_category_confidence: Optional[float]
    is_duplicate: bool
    created_at: datetime
    verified_at: Optional[datetime]
    assigned_at: Optional[datetime]
    resolved_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class ReportUpdate(BaseModel):
    status: Optional[str] = Field(None, regex=r'^(submitted|verified|assigned|in_progress|resolved|closed)$')
    assigned_department_id: Optional[int] = None
    assigned_staff_id: Optional[UUID] = None
    comment: Optional[str] = None

# Status Update Schemas
class StatusUpdateResponse(BaseModel):
    id: UUID
    old_status: str
    new_status: str
    comment: Optional[str]
    created_at: datetime
    blockchain_tx_hash: Optional[str]
    
    class Config:
        from_attributes = True

# Department Schemas
class DepartmentCreate(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    contact_email: str = Field(..., regex=r'^[^@]+@[^@]+\.[^@]+$')
    contact_phone: str = Field(..., regex=r'^\+?1?\d{9,15}$')

class DepartmentResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    contact_email: str
    contact_phone: str
    is_active: bool
    
    class Config:
        from_attributes = True

# Staff Schemas
class StaffCreate(BaseModel):
    email: str = Field(..., regex=r'^[^@]+@[^@]+\.[^@]+$')
    name: str = Field(..., max_length=255)
    department_id: int
    role: str = Field(..., regex=r'^(admin|supervisor|field_worker)$')

class StaffResponse(BaseModel):
    id: UUID
    email: str
    name: str
    department_id: int
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Analytics Schemas
class ReportStats(BaseModel):
    total_reports: int
    pending_reports: int
    resolved_reports: int
    avg_resolution_time: Optional[float]  # in hours
    reports_by_category: dict
    reports_by_priority: dict

class LocationHotspot(BaseModel):
    latitude: float
    longitude: float
    report_count: int
    avg_severity: float
    dominant_category: str

class AnalyticsResponse(BaseModel):
    stats: ReportStats
    hotspots: List[LocationHotspot]
    department_performance: dict

# File Upload Schemas
class FileUploadResponse(BaseModel):
    file_url: str
    ipfs_hash: Optional[str] = None
    file_size: int
    content_type: str

# Notification Schemas
class NotificationCreate(BaseModel):
    user_id: UUID
    message: str
    type: str = Field(..., regex=r'^(sms|email|push)$')
    
class NotificationResponse(BaseModel):
    id: UUID
    message: str
    type: str
    sent_at: datetime
    status: str  # sent, failed, pending
