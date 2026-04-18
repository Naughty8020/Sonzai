import type { StatusType } from "@/app/type/Status";

export interface Member {
  name: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  status: StatusType;
  statusLabel: string;
  statusEmoji: string;
  time: string;
}