# routers/create.py

from fastapi import APIRouter
from schemas.inquiry import InquiryUpdate, InquiryPublic
from services import inquiries_service

router = APIRouter()


@router.get("/all", response_model=list[InquiryPublic])
def list_inquiries():
    return inquiries_service.get_inquiries()
