# main.py

from fastapi import FastAPI
from routers import inquiries
from services import inquiries_service
from routers import create
from routers import get
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(inquiries.router, prefix="/api/inquiries", tags=["inquiries"])
app.include_router(create.router, prefix="/api/create", tags=["create"])
app.include_router(get.router, prefix="/api/get", tags=["get"])


# Create some mock data on startup
