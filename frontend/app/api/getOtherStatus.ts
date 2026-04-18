import type { StatusType } from "@/app/data/group";

export const statusStyles: Record<StatusType, { badge: string; dot: string }> = {
  ok: { badge: "bg-green-100 text-green-800", dot: "bg-green-500" },
  busy: { badge: "bg-amber-100 text-amber-800", dot: "bg-amber-500" },
  home: { badge: "bg-blue-100 text-blue-800", dot: "bg-blue-500" },
  sleep: { badge: "bg-purple-100 text-purple-800", dot: "bg-purple-500" },
  sos: { badge: "bg-red-100 text-red-800", dot: "bg-red-500" },
  out: { badge: "bg-zinc-100 text-zinc-800", dot: "bg-zinc-500" },
};

export function getOtherStatus(status: StatusType) {
  return statusStyles[status];
}
