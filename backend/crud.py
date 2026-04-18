from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from datetime import datetime, timezone
import schemas
from models import Group, User

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


def member_to_response(member: User) -> dict:
    status_info = STATUS[member.status]
    return {
        "id": member.id,
        "name": member.name,
        "initials": member.initials,
        "avatarBg": member.avatar_bg,
        "avatarText": member.avatar_text,
        "status": member.status,
        "statusLabel": status_info["label"],
        "statusEmoji": status_info["emoji"],
        "time": format_elapsed_time(member.updated_at),
    }

def group_to_response(group: Group) -> dict:
    return {
        "id": group.id,
        "name": group.name,
        "emoji": group.emoji,
        "color": group.color,
        "members": [member_to_response(member) for member in group.members]
    }

def get_groups(db: Session) -> list[dict]:
    groups = list[db.scalar(select(Group).all())]
    return groups

def get_group_by_id(group_id: int, db: Session)-> list[dict]:
    group = ()
    return group_to_response(group)

def update_status(payload: schemas.UpdateState, db: Session):
    new_status = payload.status
    db.add(new_status)
    db.commit()
    db.refresh(new_status)
    return new_status

