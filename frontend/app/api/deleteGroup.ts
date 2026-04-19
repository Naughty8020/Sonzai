import type { Group } from "@/app/type/Group";
import { getAuthCookie } from "@/lib/auth";

// グループ削除API
export async function deleteGroup(groupId: number, token?: string): Promise<{ message: string }> {
  const res = await fetch(`http://localhost:8000/groups/${groupId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("グループ削除に失敗しました");
  }

  return await res.json();
}
