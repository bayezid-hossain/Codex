# routers/inquiries.py

from fastapi import APIRouter, HTTPException
import uuid
from schemas.inquiry import InquiryUpdate, InquiryPublic
from services import inquiries_service

router = APIRouter()


@router.put("/{inquiry_id}", response_model=InquiryPublic)
def update_inquiry(inquiry_id: uuid.UUID, inquiry_update: InquiryUpdate):
    """
    Update an inquiry.
    """
    print(inquiry_id, inquiry_update)
    inquiry = inquiries_service.get_inquiry_by_id(inquiry_id=inquiry_id)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return inquiries_service.edit_inquiry(
        inquiry_id=inquiry_id, inquiry_update=inquiry_update
    )
