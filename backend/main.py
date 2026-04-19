from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from db import get_db
import schemas
import crud

app = FastAPI()

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

@app.get("/groups")
def read_groups(db: Session = Depends(get_db)):
    return crud.get_groups(db)

@app.get("/groups/{group_id}")
def read_groups(group_id: int, db: Session = Depends(get_db)):
    return crud.get_group_by_id(group_id, db)

@app.post("/groups")
def create_group(payload: schemas.CreateGroup, db: Session = Depends(get_db)):
    return crud.create_group(payload, db)

@app.post("/groups/{grooup_id}/members")
def create_member(group_id: int, payload: schemas.MemberCreate, db: Session = Depends(get_db)):
    return crud.create_member(group_id, payload, db)

@app.patch("/groups/{group_id}/status")
def patch_member_status(payload: schemas.UpdateState, user_id: int, db: Session = Depends(get_db)):
    return crud.update_status(payload, user_id, db)

@app.post("/groups{group_id}/invite")
def invite_link(group_id: int, db: Session = Depends(get_db)):
    return crud.create_group(group_id, db)