from sqlalchemy.orm import Session

import schemas
from models import Group

def create_group(payload: schemas.CreateGroup, db: Session):
    new_group = Group(
        name = payload.name,
        emoji = payload.emoji,
        color = payload.color
    )
    db.add(new_group)
    db.commit()
    db.refresh(new_group)
    return {
        "id": new_group.id,
        "name": new_group.name,
        "emoji": new_group.emoji,
        "color": new_group.color,
        "users": []
    }

def update_status(payload: schemas.UpdateState, db: Session):
    new_status = payload.status
    db.add(new_status)
    db.commit()
    db.refresh(new_status)
    return new_status

