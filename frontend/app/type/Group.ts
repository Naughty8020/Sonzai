import type { Member } from "@/app/type/Member";

export interface Group {
  id: number;
  name: string;
  emoji: string;
  color: string;
  members: Member[];
}