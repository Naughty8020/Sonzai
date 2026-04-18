from sqlalchemy.orm import Session

from schemas import CreateGroup
from models import Group

def create_group(new_group_value: CreateGroup, db: Session):
    new_group = Group(
        name = new_group_value.name,
        emoji = new_group_value.emoji,
        color = new_group_value.color
    )
    db.add(new_group)
    db.commit()
    db.refresh(new_group)
    return new_group