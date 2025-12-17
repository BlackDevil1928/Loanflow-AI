from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class ChatMessage(BaseModel):
    message: str
    user_id: str
    has_file: bool = False

class ChatResponse(BaseModel):
    response: str
    data: Optional[Dict[str, Any]] = None

class LoanApplication(BaseModel):
    user_id: str
    income: float
    employment_type: str
    credit_score: Optional[int] = None
    loan_amount: Optional[float] = None
    interest_rate: Optional[float] = None
    status: str = "PENDING"

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    created_at: Optional[datetime] = None

class KYCDocument(BaseModel):
    user_id: str
    document_type: str
    extracted_text: str
    verified: bool = False
