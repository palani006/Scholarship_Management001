from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, scholarships, applications

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Scholarship Management API",
    description="A system to manage scholarships and student applications",
    version="1.0.0",
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(auth.router)
app.include_router(scholarships.router)
app.include_router(applications.router)


@app.get("/")
def root():
    return {"message": "Scholarship Management API", "version": "1.0.0"}
