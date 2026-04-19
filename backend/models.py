from __future__ import annotations
from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from datetime import datetime, timezone, timedelta
from typing import Literal
from datetime import datetime, timezone
from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

StatusType = Literal["ok", "busy", "home", "out", "sleep", "sos"]

now = datetime.now(timezone(timedelta(hours=9)))

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
        index=True,
    )
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=now,
    )

class Group(Base):
    __tablename__ = "groups"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    emoji: Mapped[str] = mapped_column(nullable=False)
    color: Mapped[str] = mapped_column(nullable=False)
    members: Mapped[list[Member]] = relationship(
        "Member",
        back_populates="group",
        cascade="all, delete-orphan",
        order_by="Member.id"
    )

class Member(Base):
    __tablename__ = "members"

    id: Mapped[int] = mapped_column(primary_key=True)
    group_id: Mapped[int] = mapped_column(ForeignKey("groups.id"))

    name: Mapped[str] = mapped_column(nullable=False)
    initial: Mapped[str] = mapped_column(nullable=False)
    avatar_bg: Mapped[str] = mapped_column(nullable=False)
    avatar_text: Mapped[str] = mapped_column(nullable=False)
    status: Mapped[StatusType] = mapped_column(nullable=False, default="ok")
    update_time: Mapped[datetime] = mapped_column(DateTime(timezone=timedelta(hours=9)), nullable=False)

    group: Mapped[Group] = relationship("Group", back_populates="members")