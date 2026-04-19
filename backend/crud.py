from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta

from . import schemas
from .models import Group, User, Member
from .login import create_login_token, hash_password, verify_password

JST = timezone(timedelta(hours=9))


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


def register_login_user(
    db: Session,
    payload: schemas.LoginRegister,
) -> schemas.LoginTokenResponse:
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


def login_user(
    db: Session,
    payload: schemas.LoginRequest,
) -> schemas.LoginTokenResponse:
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


SEED_GROUPS: list[schemas.GroupSeed] = [
    schemas.GroupSeed(
        name="家族",
        emoji="🏠",
        color="bg-purple-50",
        members=[
            {"name": "お父さん", "initial": "父", "avatar_bg": "bg-blue-100",
                "avatar_text": "text-blue-800", "status": "ok"},
            {"name": "お母さん", "initial": "母", "avatar_bg": "bg-green-100",
                "avatar_text": "text-green-800", "status": "busy"},
            {"name": "妹", "initial": "妹", "avatar_bg": "bg-pink-100",
                "avatar_text": "text-pink-800", "status": "sleep"},
            {"name": "兄", "initial": "兄", "avatar_bg": "bg-amber-100",
                "avatar_text": "text-amber-800", "status": "home"},
        ],
    ),
    schemas.GroupSeed(
        name="親友",
        emoji="⭐",
        color="bg-green-50",
        members=[
            {"name": "さくら", "initial": "さ", "avatar_bg": "bg-pink-100",
                "avatar_text": "text-pink-800", "status": "ok"},
            {"name": "けんた", "initial": "け", "avatar_bg": "bg-purple-100",
                "avatar_text": "text-purple-800", "status": "busy"},
            {"name": "みほ", "initial": "み", "avatar_bg": "bg-green-100",
                "avatar_text": "text-green-800", "status": "home"},
        ],
    ),
]


def format_elapsed_time(updated_at: datetime) -> str:
    now = datetime.now(JST)

    if updated_at.tzinfo is None:
        updated_at = updated_at.replace(tzinfo=JST)

    seconds = int((now - updated_at).total_seconds())

    if seconds < 60:
        return "今"
    if seconds < 3600:
        return f"{seconds // 60}分前"
    if seconds < 86400:
        return f"{seconds // 3600}時間前"
    return f"{seconds // 86400}日前"


def create_group(payload: schemas.CreateGroup, db: Session) -> dict:
    new_group = Group(
        name=payload.name,
        emoji=payload.emoji,
        color=payload.color,
    )
    db.add(new_group)
    db.commit()
    db.refresh(new_group)

    return {
        "id": new_group.id,
        "name": new_group.name,
        "emoji": new_group.emoji,
        "color": new_group.color,
        "members": [],
    }


def create_member(group_id: int, payload: schemas.MemberCreate, db: Session) -> dict:
    group = db.scalar(select(Group).where(Group.id == group_id))
    if group is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="グループが存在しません",
        )

    member = Member(
        group_id=group.id,
        name=payload.name.strip(),
        initial=payload.initial,
        avatar_bg=payload.avatarBg,
        avatar_text=payload.avatarText,
        status=payload.status,
        update_time=datetime.now(JST),
    )
    db.add(member)
    db.commit()
    db.refresh(member)

    return member_to_response(member)


def member_to_response(member: Member) -> dict:
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
        "members": [member_to_response(member) for member in group.members],
    }


def get_my_groups(db: Session, user_id: int) -> list[dict]:
    my_group = (
        select(Group)
        .join(Member, Member.group_id == Group.id)
        .where(Member.user_id == user_id)
        .distinct()
    )
    groups = db.scalars(my_group).all()
    return [group_to_response(group) for group in groups]


def get_group_by_id(group_id: int, db: Session) -> dict:
    group = db.scalar(select(Group).where(Group.id == group_id))
    if group is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="グループが存在しません",
        )
    return group_to_response(group)


def update_status(payload: schemas.UpdateState, member_id: int, db: Session) -> dict:
    member = db.scalar(select(Member).where(Member.id == member_id))
    if member is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="メンバーが存在しません",
        )

    member.status = payload.status
    member.update_time = datetime.now(JST)
    db.commit()
    db.refresh(member)

    return member_to_response(member)


def create_invite_link(group_id: int, db: Session) -> dict:
    group = db.scalar(select(Group).where(Group.id == group_id))
    if group is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="グループが存在しません",
        )

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
            member = Member(
                group_id=group.id,
                name=seed_member.name,
                initial=seed_member.initial,
                avatar_bg=seed_member.avatar_bg,
                avatar_text=seed_member.avatar_text,
                status=seed_member.status,
                update_time=datetime.now(JST),
            )
            db.add(member)

    db.commit()


def search_users_by_name(db: Session, name_query: str) -> list[dict]:
    stmt = select(User).where(User.name.ilike(f"%{name_query}%"))
    users = db.scalars(stmt).all()
    return [{"id": user.id, "name": user.name, "email": user.email} for user in users]


from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Group


def delete_group(group_id: int, db: Session) -> dict:
    group = db.scalar(select(Group).where(Group.id == group_id))
    if group is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="グループが存在しません",
        )

    db.delete(group)
    db.commit()

    return {
        "message": "グループを削除しました",
        "deletedGroupId": group_id,
    }