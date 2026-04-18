from sqlalchemy.orm import Session
from datetime import datetime, timezone
import schemas
from models import Group

STATUS = {
    "ok": {"label": "元気", "emoji": "😊"},
    "busy": {"label": "忙しい", "emoji": "⚡"},
    "home": {"label": "在宅", "emoji": "🏠"},
    "out": {"label": "外出中", "emoji": "🚶"},
    "sleep": {"label": "就寝", "emoji": "😴"},
    "sos": {"label": "SOS", "emoji": "🆘"},
}

def format_elapsed_time(updated_at: datetime) -> str:
    now = datetime.now(timezone.utc)

    if updated_at.tzinfo is None:
        updated_at = updated_at.replace(tzinfo=timezone.utc)

    seconds = int((now - updated_at).total_seconds())

    if seconds < 60:
        return "今"
    if seconds < 3600:
        return f"{seconds // 60}分前"
    if seconds < 86400:
        return f"{seconds // 3600}時間前"
    else:
        return f"{seconds // 86400}日前"

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

