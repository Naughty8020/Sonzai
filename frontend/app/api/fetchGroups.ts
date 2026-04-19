import type { Group } from "@/app/type/Group";

// グループ一覧取得API
export async function fetchGroups(token?: string): Promise<Group[]> {
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