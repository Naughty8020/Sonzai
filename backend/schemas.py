from pydantic import BaseModel, Field
from models import StatusType

class UserRegister(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    email: str = Field(..., min_length=1, max_length=255)
    password: str = Field(..., min_length=8, max_length=255)

class UserLogin(BaseModel):
    email: str = Field(..., min_length=1, max_length=255)
    password: str = Field(..., min_length=8, max_length=255)

class CurrentUserResponse(BaseModel):
    id: int
    name: str
    email: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: CurrentUserResponse

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

