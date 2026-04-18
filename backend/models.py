from sqlalchemy import ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from datetime import datetime, timezone, timedelta
from typing import Literal

StatusType = Literal["ok", "busy", "home", "out", "sleep", "sos"]

now_time_jst = datetime.now(timezone(timedelta(hours=9)))

class Base(DeclarativeBase):
    pass

class Group(Base):
    __tablename__ = "groups"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    emoji: Mapped[str] = mapped_column(nullable=False)
    color: Mapped[str] = mapped_column(nullable=False)
    users: Mapped[relationship] = relationship(
        "User",
        back_populates="group",
        cascade="all, delete-orphan",
        order_by="user.id"
    )

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    group_id: Mapped[int] = mapped_column(ForeignKey("groups.id"))

    name: Mapped[str] = mapped_column(nullable=False)
    initial: Mapped[str] = mapped_column(nullable=False)
    avatar_bg: Mapped[str] = mapped_column(nullable=False)
    avatar_text: Mapped[str] = mapped_column(nullable=False)
    status: Mapped[StatusType] = mapped_column(StatusType, nullable=False, default=StatusType[0])
    update_time: Mapped[datetime] = mapped_column(datetime(timezone=True), nullable=False)

    group: Mapped[relationship] = relationship("Group", back_populates="users")