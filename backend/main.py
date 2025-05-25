# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.analytics import router
from src.past.frequency import *
from src.past.read import *
from src.past.wrapped import *
import requests
from src.future.incremento import router as incremento_router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
app.include_router(router)
app.include_router(incremento_router)


