import os

class Settings:
    PROJECT_NAME: str = "SIF Intelligence Safety Command Center API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "sif_intelligence_db")

settings = Settings()
