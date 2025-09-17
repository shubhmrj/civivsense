from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
from typing import List, Dict, Any
import asyncio

from .services.image_classifier import ImageClassifierService
from .services.nlp_processor import NLPProcessorService
from .services.duplicate_detector import DuplicateDetectorService
from .services.priority_scorer import PriorityScorerService
from .models.schemas import (
    ReportAnalysisRequest,
    ReportAnalysisResponse,
    ImageClassificationResponse,
    NLPAnalysisResponse
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Civic Reporting ML Services",
    description="AI/ML microservices for civic issue analysis and processing",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML services
image_classifier = ImageClassifierService()
nlp_processor = NLPProcessorService()
duplicate_detector = DuplicateDetectorService()
priority_scorer = PriorityScorerService()

@app.on_event("startup")
async def startup_event():
    """Load ML models on startup"""
    logger.info("Loading ML models...")
    
    await asyncio.gather(
        image_classifier.load_model(),
        nlp_processor.load_model(),
        duplicate_detector.load_model(),
        priority_scorer.load_model()
    )
    
    logger.info("All ML models loaded successfully")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "ML services are running",
        "models_loaded": {
            "image_classifier": image_classifier.is_loaded,
            "nlp_processor": nlp_processor.is_loaded,
            "duplicate_detector": duplicate_detector.is_loaded,
            "priority_scorer": priority_scorer.is_loaded
        }
    }

@app.post("/api/analyze/image", response_model=ImageClassificationResponse)
async def classify_image(file: UploadFile = File(...)):
    """Classify civic issue from image"""
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image data
        image_data = await file.read()
        
        # Classify image
        result = await image_classifier.classify(image_data)
        
        return ImageClassificationResponse(**result)
        
    except Exception as e:
        logger.error(f"Image classification failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/text", response_model=NLPAnalysisResponse)
async def analyze_text(request: dict):
    """Analyze text description using NLP"""
    try:
        text = request.get("text", "")
        if not text:
            raise HTTPException(status_code=400, detail="Text is required")
        
        result = await nlp_processor.analyze(text)
        
        return NLPAnalysisResponse(**result)
        
    except Exception as e:
        logger.error(f"Text analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/report", response_model=ReportAnalysisResponse)
async def analyze_full_report(
    title: str,
    description: str,
    latitude: float,
    longitude: float,
    images: List[UploadFile] = File([])
):
    """Complete analysis of a civic report"""
    try:
        # Analyze images
        image_results = []
        if images:
            for image in images:
                if image.filename:
                    image_data = await image.read()
                    result = await image_classifier.classify(image_data)
                    image_results.append(result)
        
        # Analyze text
        full_text = f"{title} {description}"
        text_analysis = await nlp_processor.analyze(full_text)
        
        # Check for duplicates
        duplicate_check = await duplicate_detector.check_duplicate(
            title, description, latitude, longitude, image_results
        )
        
        # Calculate priority score
        priority_score = await priority_scorer.calculate_priority(
            text_analysis, image_results, latitude, longitude
        )
        
        # Combine results
        analysis_result = {
            "category": image_results[0]["category"] if image_results else text_analysis["category"],
            "confidence": max([r["confidence"] for r in image_results] + [text_analysis["confidence"]]),
            "priority_score": priority_score,
            "severity_level": priority_scorer.get_severity_level(priority_score),
            "is_duplicate": duplicate_check["is_duplicate"],
            "duplicate_report_id": duplicate_check.get("duplicate_report_id"),
            "detected_objects": [obj for result in image_results for obj in result.get("objects", [])],
            "sentiment": text_analysis["sentiment"],
            "urgency_keywords": text_analysis["urgency_keywords"],
            "location_risk_score": priority_scorer.get_location_risk(latitude, longitude)
        }
        
        return ReportAnalysisResponse(**analysis_result)
        
    except Exception as e:
        logger.error(f"Report analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/detect/duplicates")
async def detect_duplicates(request: dict):
    """Check if a report is a duplicate of existing reports"""
    try:
        result = await duplicate_detector.check_duplicate(
            title=request.get("title", ""),
            description=request.get("description", ""),
            latitude=request.get("latitude", 0),
            longitude=request.get("longitude", 0),
            image_features=request.get("image_features", [])
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Duplicate detection failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict/hotspots")
async def predict_hotspots(request: dict):
    """Predict potential issue hotspots"""
    try:
        # This would use historical data and ML models to predict hotspots
        # For now, return a placeholder response
        return {
            "predicted_hotspots": [],
            "confidence": 0.0,
            "prediction_horizon_days": 7
        }
        
    except Exception as e:
        logger.error(f"Hotspot prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/models/status")
async def get_models_status():
    """Get status of all ML models"""
    return {
        "image_classifier": {
            "loaded": image_classifier.is_loaded,
            "model_version": image_classifier.model_version,
            "last_updated": image_classifier.last_updated
        },
        "nlp_processor": {
            "loaded": nlp_processor.is_loaded,
            "model_version": nlp_processor.model_version,
            "last_updated": nlp_processor.last_updated
        },
        "duplicate_detector": {
            "loaded": duplicate_detector.is_loaded,
            "model_version": duplicate_detector.model_version,
            "last_updated": duplicate_detector.last_updated
        },
        "priority_scorer": {
            "loaded": priority_scorer.is_loaded,
            "model_version": priority_scorer.model_version,
            "last_updated": priority_scorer.last_updated
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
