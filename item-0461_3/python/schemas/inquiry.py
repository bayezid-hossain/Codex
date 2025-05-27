# schemas/inquiry.py

from pydantic import BaseModel
import uuid
from typing import Optional


class InquiryBase(BaseModel):
    text: str
    description: Optional[str] = None
    status: str = "open"


class InquiryUpdate(BaseModel):
    text: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class InquiryPublic(InquiryBase):
    id: uuid.UUID

    class Config:
        orm_mode = True
