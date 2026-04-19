from pydantic import BaseModel, Field
from models import StatusType

class CreateGroup(BaseModel):
    name: str = Field(..., min_length=1)
    emoji: str = Field(..., min_length=1)
    color: str 
    
class MemberCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    initials: str
    avatarBg: str
    avatarText: str
    status: StatusType

class UpdateState(BaseModel):
    status: StatusType

class MemberSeed(BaseModel):
    name: str
    initials: str
    avatar_bg: str
    avatar_text: str
    status: StatusType

class GroupSeed(BaseModel):
    name: str
    emoji: str
    color: str
    members: list[MemberSeed]

