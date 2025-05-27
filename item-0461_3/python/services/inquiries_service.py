# services/inquiries_service.py

import uuid
from typing import Dict
from schemas.inquiry import InquiryPublic, InquiryUpdate
from uuid import UUID

# Mock "database"
mock_inquiries: Dict[uuid.UUID, InquiryPublic] = {}


def get_inquiries() -> list[InquiryPublic]:
    return list(mock_inquiries.values())


def get_inquiry_by_id(inquiry_id: UUID) -> InquiryPublic | None:
    return mock_inquiries.get(inquiry_id)


def edit_inquiry(inquiry_id: uuid.UUID, inquiry_update: InquiryUpdate) -> InquiryPublic:
    inquiry = mock_inquiries.get(inquiry_id)
    if not inquiry:
        raise Exception("Inquiry not found during edit")

    updated_data = inquiry.dict()

    for field, value in inquiry_update.dict(exclude_unset=True).items():
        updated_data[field] = value

    updated_inquiry = InquiryPublic(**updated_data)
    mock_inquiries[inquiry_id] = updated_inquiry
    return updated_inquiry


def create_mock_inquiry(
    text: str, description: str = "", status: str = "open"
) -> InquiryPublic:
    inquiry_id = UUID("1e7a6e9f-2cf5-4dc7-878f-061ee4dc5f52")
    inquiry = InquiryPublic(
        id=inquiry_id, text=text, description=description, status=status
    )
    mock_inquiries[inquiry_id] = inquiry
    return inquiry


def create_inquiry(
    inquiry_id: uuid.UUID, inquiry_update: InquiryUpdate
) -> InquiryPublic:
    inquiry = InquiryPublic(id=inquiry_id, text=inquiry_update.text, description="")
    mock_inquiries[inquiry_id] = inquiry
    return inquiry
