from pydantic import BaseModel, Field
from models import StatusType

class CreateGroup(BaseModel):
    name: str = Field(..., min_length=1)
    emoji: str = Field(..., min_length=1)
    color: str 