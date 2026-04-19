
import type { StatusType } from "@/app/type/Status";

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

// 他メンバーのstatus状況を取得する関数
export async function fetchOtherStatuses(groupId: number, token?: string) {
  const res = await fetch(`http://localhost:8000/groups/${groupId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("ステータス取得に失敗しました");
  }

  const data = await res.json();
  // data.members: [{ name, status, ... }]
  return data.members.map((member: { name: string; status: StatusType }) => ({
    name: member.name,
    status: member.status,
  }));
}
