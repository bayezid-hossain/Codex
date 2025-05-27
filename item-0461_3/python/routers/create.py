# routers/create.py
import uuid
from fastapi import APIRouter
from schemas.inquiry import InquiryUpdate, InquiryPublic
from services import inquiries_service

router = APIRouter()


@router.post("/{inquiry_id}", response_model=InquiryPublic)
def create_inquiry(inquiry_id: uuid.UUID, inquiry_update: InquiryUpdate):
    """
    Create an inquiry.
    """

    print(inquiry_update)
    return inquiries_service.create_inquiry(inquiry_id, inquiry_update)
