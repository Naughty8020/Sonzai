from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, schemas
from .db import get_db, db_engine
from .login import get_current_login_user
from .models import User, Base

app = FastAPI()


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=db_engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Hello, World!"}


@app.post("/login/register")
def register(payload: schemas.LoginRegister, db: Session = Depends(get_db)):
    return crud.register_login_user(db, payload)


@app.post("/login")
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    return crud.login_user(db, payload)


@app.get("/login/me")
def read_current_login_user(
    current_user: User = Depends(get_current_login_user),
):
    return crud.user_to_login_response(current_user)


@app.get("/groups")
def read_groups(db: Session = Depends(get_db)):
    return crud.get_groups(db)


@app.get("/groups/{group_id}")
def read_group(group_id: int, db: Session = Depends(get_db)):
    return crud.get_group_by_id(group_id, db)


@app.post("/groups")
def create_group(payload: schemas.CreateGroup, db: Session = Depends(get_db)):
    return crud.create_group(payload, db)


@app.post("/groups/{group_id}/members")
def create_member(
    group_id: int,
    payload: schemas.MemberCreate,
    db: Session = Depends(get_db),
):
    return crud.create_member(group_id, payload, db)


@app.patch("/status")
def patch_member_status(
    payload: schemas.UpdateState,
    member_id: int,
    db: Session = Depends(get_db),
):
    return crud.update_status(payload, member_id, db)


@app.post("/groups/{group_id}/invite")
def invite_link(group_id: int, db: Session = Depends(get_db)):
    return crud.create_invite_link(group_id, db)


@app.get("/users/search")
def search_users(name: str, db: Session = Depends(get_db)):
    return crud.search_users_by_name(db, name)
