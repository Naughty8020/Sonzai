import type { Group } from "@/app/type/Group";
import { getAuthCookie } from "@/lib/auth";

export async function fetchGroups(): Promise<Group[]> {
  const token = getAuthCookie();
  const res = await fetch("http://localhost:8000/groups", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("グループ一覧取得に失敗しました");
  }
  return await res.json();
}