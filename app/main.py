from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn
import logging

from .database import get_db, create_tables
from .models.schemas import (
    ReportCreate, ReportResponse, ReportUpdate,
    UserCreate, UserResponse,
    DepartmentCreate, DepartmentResponse,
    StaffCreate, StaffResponse,
    AnalyticsResponse, FileUploadResponse
)
from .services.report_service import ReportService
from .services.user_service import UserService
from .services.ai_service import AIService
from .services.blockchain_service import BlockchainService
from .services.file_service import FileService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Civic Issue Reporting System",
    description="Smart India Hackathon - AI-powered civic issue reporting with blockchain transparency",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
report_service = ReportService()
user_service = UserService()
ai_service = AIService()
blockchain_service = BlockchainService()
file_service = FileService()

@app.on_event("startup")
async def startup_event():
    """Initialize database and services on startup"""
    create_tables()
    logger.info("Database tables created successfully")
    
    # Initialize AI models
    await ai_service.load_models()
    logger.info("AI models loaded successfully")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Civic reporting system is running"}

# User endpoints
@app.post("/api/users/register", response_model=UserResponse)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user (citizen)"""
    try:
        return await user_service.create_user(db, user)
    except Exception as e:
        logger.error(f"User registration failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, db: Session = Depends(get_db)):
    """Get user details"""
    user = await user_service.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Report endpoints
@app.post("/api/reports", response_model=ReportResponse)
async def create_report(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    address: Optional[str] = Form(None),
    ward_number: Optional[str] = Form(None),
    user_id: Optional[str] = Form(None),
    is_anonymous: bool = Form(False),
    images: List[UploadFile] = File([]),
    db: Session = Depends(get_db)
):
    """Submit a new civic issue report"""
    try:
        # Handle file uploads
        image_urls = []
        if images:
            for image in images:
                if image.filename:
                    upload_result = await file_service.upload_file(image)
                    image_urls.append(upload_result.file_url)
        
        # Create report data
        report_data = ReportCreate(
            title=title,
            description=description,
            category=category,
            latitude=latitude,
            longitude=longitude,
            address=address,
            ward_number=ward_number,
            image_urls=image_urls,
            is_anonymous=is_anonymous
        )
        
        # Process with AI
        ai_analysis = await ai_service.analyze_report(report_data, image_urls)
        
        # Create report
        report = await report_service.create_report(db, report_data, user_id, ai_analysis)
        
        # Store on blockchain (async)
        blockchain_service.store_report_async(report)
        
        logger.info(f"Report created successfully: {report.id}")
        return report
        
    except Exception as e:
        logger.error(f"Report creation failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/reports", response_model=List[ReportResponse])
async def get_reports(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    category: Optional[str] = None,
    department_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get reports with filtering options"""
    return await report_service.get_reports(
        db, skip=skip, limit=limit, status=status, 
        category=category, department_id=department_id
    )

@app.get("/api/reports/{report_id}", response_model=ReportResponse)
async def get_report(report_id: str, db: Session = Depends(get_db)):
    """Get specific report details"""
    report = await report_service.get_report(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@app.put("/api/reports/{report_id}", response_model=ReportResponse)
async def update_report(
    report_id: str, 
    update_data: ReportUpdate,
    staff_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Update report status (admin/staff only)"""
    try:
        report = await report_service.update_report(db, report_id, update_data, staff_id)
        
        # Update blockchain
        if report.blockchain_tx_hash:
            blockchain_service.update_report_status_async(report)
        
        return report
    except Exception as e:
        logger.error(f"Report update failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/reports/{report_id}/status-history")
async def get_report_status_history(report_id: str, db: Session = Depends(get_db)):
    """Get status update history for a report"""
    return await report_service.get_status_history(db, report_id)

# Department endpoints
@app.post("/api/departments", response_model=DepartmentResponse)
async def create_department(department: DepartmentCreate, db: Session = Depends(get_db)):
    """Create a new department"""
    return await report_service.create_department(db, department)

@app.get("/api/departments", response_model=List[DepartmentResponse])
async def get_departments(db: Session = Depends(get_db)):
    """Get all departments"""
    return await report_service.get_departments(db)

# Staff endpoints
@app.post("/api/staff", response_model=StaffResponse)
async def create_staff(staff: StaffCreate, db: Session = Depends(get_db)):
    """Create a new staff member"""
    return await report_service.create_staff(db, staff)

# Analytics endpoints
@app.get("/api/analytics", response_model=AnalyticsResponse)
async def get_analytics(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    department_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get analytics and insights"""
    return await report_service.get_analytics(db, start_date, end_date, department_id)

@app.get("/api/analytics/hotspots")
async def get_hotspots(
    radius_km: float = 1.0,
    min_reports: int = 5,
    db: Session = Depends(get_db)
):
    """Get issue hotspots on the map"""
    return await report_service.get_hotspots(db, radius_km, min_reports)

# File upload endpoint
@app.post("/api/upload", response_model=FileUploadResponse)
async def upload_file(file: UploadFile = File(...)):
    """Upload a file (image/video) to storage"""
    try:
        return await file_service.upload_file(file)
    except Exception as e:
        logger.error(f"File upload failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# Blockchain verification endpoint
@app.get("/api/reports/{report_id}/verify")
async def verify_report_blockchain(report_id: str, db: Session = Depends(get_db)):
    """Verify report data against blockchain"""
    try:
        report = await report_service.get_report(db, report_id)
        if not report or not report.blockchain_tx_hash:
            raise HTTPException(status_code=404, detail="Report or blockchain record not found")
        
        verification = await blockchain_service.verify_report(report)
        return verification
    except Exception as e:
        logger.error(f"Blockchain verification failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# Search endpoint
@app.get("/api/search/reports")
async def search_reports(
    q: str,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius_km: Optional[float] = None,
    db: Session = Depends(get_db)
):
    """Search reports by text and/or location"""
    return await report_service.search_reports(db, q, latitude, longitude, radius_km)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
