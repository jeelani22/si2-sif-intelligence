import sys
import os

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes.dashboard import router as dashboard_router
from app.routes.reports import router as reports_router
from app.routes.cases import router as cases_router
from app.routes.patterns import router as patterns_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for SIF Intelligence Safety Command Center MVP"
)

# Enable CORS for React Frontend (port 3000, 5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers under /api
app.include_router(dashboard_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
app.include_router(cases_router, prefix="/api")
app.include_router(patterns_router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "SIF Intelligence Safety Command Center API is running",
        "docs": "/docs",
        "health": "/api/health"
    }
