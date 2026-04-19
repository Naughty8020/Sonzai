from pydantic import BaseModel, Field
from .models import StatusType

class LoginRegister(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    email: str = Field(..., min_length=1, max_length=255)
    password: str = Field(..., min_length=8, max_length=255)

class LoginRequest(BaseModel):
    email: str = Field(..., min_length=1, max_length=255)
    password: str = Field(..., min_length=8, max_length=255)

class LoginUserResponse(BaseModel):
    id: int
    name: str
    email: str

class LoginTokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: LoginUserResponse

class CreateGroup(BaseModel):
    name: str = Field(..., min_length=1)
    emoji: str = Field(..., min_length=1)
    color: str 
    
class MemberCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    initial: str
    avatarBg: str
    avatarText: str
    status: StatusType

class UpdateState(BaseModel):
    status: StatusType

class MemberSeed(BaseModel):
    name: str
    initial: str
    avatar_bg: str
    avatar_text: str
    status: StatusType

class GroupSeed(BaseModel):
    name: str
    emoji: str
    color: str
    members: list[MemberSeed]

