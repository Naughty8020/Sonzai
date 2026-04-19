from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
import schemas
from models import Group, User
from login import create_login_token, hash_password, verify_password



def normalize_email(email: str) -> str:
    return email.strip().lower()


def user_to_login_response(user: User) -> schemas.LoginUserResponse:
    return schemas.LoginUserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
    )


def build_login_token_response(user: User) -> schemas.LoginTokenResponse:
    return schemas.LoginTokenResponse(
        access_token=create_login_token(user.id),
        token_type="bearer",
        user=user_to_login_response(user),
    )


def get_user_by_email(db: Session, email: str) -> User | None:
    stmt = select(User).where(User.email == normalize_email(email))
    return db.scalar(stmt)


def register_login_user(db: Session, payload: schemas.LoginRegister) -> schemas.LoginTokenResponse:
    email = normalize_email(payload.email)

    existing_user = get_user_by_email(db, email)
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="このメールアドレスはすでに使われています",
        )

    user = User(
        name=payload.name.strip(),
        email=email,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return build_login_token_response(user)


def login_user(db: Session, payload: schemas.LoginRequest) -> schemas.LoginTokenResponse:
    user = get_user_by_email(db, payload.email)

    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="メールアドレスまたはパスワードが違います",
        )

    return build_login_token_response(user)

STATUS = {
    "ok": {"label": "元気", "emoji": "😊"},
    "busy": {"label": "忙しい", "emoji": "⚡"},
    "home": {"label": "在宅", "emoji": "🏠"},
    "out": {"label": "外出中", "emoji": "🚶"},
    "sleep": {"label": "就寝", "emoji": "😴"},
    "sos": {"label": "SOS", "emoji": "🆘"},
}

# 暫定的な初期データ
SEED_GROUPS: list[schemas.GroupSeed] = [
    schemas.GroupSeed(
        name="家族",
        emoji="🏠",
        color="bg-purple-50",
        members=[
            {"name": "お父さん", "initials": "父", "avatar_bg": "bg-blue-100", "avatar_text": "text-blue-800", "status": "ok"},
            {"name": "お母さん", "initials": "母", "avatar_bg": "bg-green-100", "avatar_text": "text-green-800", "status": "busy"},
            {"name": "妹", "initials": "妹", "avatar_bg": "bg-pink-100", "avatar_text": "text-pink-800", "status": "sleep"},
            {"name": "兄", "initials": "兄", "avatar_bg": "bg-amber-100", "avatar_text": "text-amber-800", "status": "home"},
        ],
    ),
    schemas.GroupSeed(
        name="親友",
        emoji="⭐",
        color="bg-green-50",
        members=[
            {"name": "さくら", "initials": "さ", "avatar_bg": "bg-pink-100", "avatar_text": "text-pink-800", "status": "ok"},
            {"name": "けんた", "initials": "け", "avatar_bg": "bg-purple-100", "avatar_text": "text-purple-800", "status": "busy"},
            {"name": "みほ", "initials": "み", "avatar_bg": "bg-green-100", "avatar_text": "text-green-800", "status": "home"},
        ],
    ),
    schemas.GroupSeed(
        name="職場",
        emoji="💼",
        color="bg-blue-50",
        members=[
            {"name": "田中さん", "initials": "田", "avatar_bg": "bg-blue-100", "avatar_text": "text-blue-800", "status": "busy"},
            {"name": "鈴木さん", "initials": "鈴", "avatar_bg": "bg-green-100", "avatar_text": "text-green-800", "status": "ok"},
            {"name": "伊藤さん", "initials": "伊", "avatar_bg": "bg-amber-100", "avatar_text": "text-amber-800", "status": "home"},
            {"name": "佐藤さん", "initials": "佐", "avatar_bg": "bg-purple-100", "avatar_text": "text-purple-800", "status": "sleep"},
            {"name": "高橋さん", "initials": "高", "avatar_bg": "bg-pink-100", "avatar_text": "text-pink-800", "status": "busy"},
            {"name": "山田さん", "initials": "山", "avatar_bg": "bg-red-100", "avatar_text": "text-red-800", "status": "sos"},
        ],
    ),
    schemas.GroupSeed(
        name="趣味仲間",
        emoji="🎮",
        color="bg-amber-50",
        members=[
            {"name": "りょう", "initials": "り", "avatar_bg": "bg-amber-100", "avatar_text": "text-amber-800", "status": "ok"},
            {"name": "あかね", "initials": "あ", "avatar_bg": "bg-pink-100", "avatar_text": "text-pink-800", "status": "home"},
            {"name": "そうた", "initials": "そ", "avatar_bg": "bg-green-100", "avatar_text": "text-green-800", "status": "busy"},
            {"name": "はな", "initials": "は", "avatar_bg": "bg-purple-100", "avatar_text": "text-purple-800", "status": "sleep"},
            {"name": "たくや", "initials": "た", "avatar_bg": "bg-blue-100", "avatar_text": "text-blue-800", "status": "ok"},
        ],
    ),
]


def format_elapsed_time(updated_at: datetime) -> str:
    now = datetime.now(timezone(timedelta(hours=9)))

    if updated_at.tzinfo is None:
        updated_at = updated_at.replace(tzinfo=timezone(timedelta(hours=9)))

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
        "members": []
    }

def create_member(group_id: int, payload: schemas.MemberCreate, db: Session) -> dict:
    group = db.scalar(select(Group).where(Group.id == group_id))
    member = User(
        group_id=group.id,
        name=payload.name.strip(),
        initial=payload.initial,
        avatar_bg=payload.avatarBg,
        avatar_text=payload.avatarText,
        status=payload.status,
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member_to_response(member)

def member_to_response(member: User) -> dict:
    status_info = STATUS[member.status]
    return {
        "id": member.id,
        "name": member.name,
        "initial": member.initial,
        "avatarBg": member.avatar_bg,
        "avatarText": member.avatar_text,
        "status": member.status,
        "statusLabel": status_info["label"],
        "statusEmoji": status_info["emoji"],
        "time": format_elapsed_time(member.update_time),
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
    return [group_to_response(group) for group in groups]

def get_group_by_id(group_id: int, db: Session)-> list[dict]:
    group = db.scalar(select(Group).where(Group.id == group_id))
    return group_to_response(group)

def update_status(payload: schemas.UpdateState, user_id: int, db: Session):
    user = db.scalar(select(User).where(User.id == user_id))
    user.status = payload.status
    user.update_time = datetime.now(timezone(timedelta(hours=9)))
    db.commit()
    db.refresh(user)
    return member_to_response(user)

def create_invite_link(group_id: int, db: Session) -> dict:
    group = db.scalar(select(Group).where(Group.id == group_id))
    return {
        "group_id": group.id,
        "invite_link": f"http://localhost:3000/invite/{group.id}",
        "message": f"「{group.name}」の招待リンクを発行しました",
    }

def seed_database(db: Session) -> None:
    if db.query(Group).first():
        return

    for seed_group in SEED_GROUPS:
        group = Group(
            name=seed_group.name,
            emoji=seed_group.emoji,
            color=seed_group.color,
        )
        db.add(group)
        db.flush()

        for seed_member in seed_group.members:
            member = User(
                group_id=group.id,
                name=seed_member.name,
                initials=seed_member.initials,
                avatar_bg=seed_member.avatar_bg,
                avatar_text=seed_member.avatar_text,
                status=seed_member.status,
            )
            db.add(member)
    db.commit()