import type { Group } from "@/app/type/Group";

// 新規グループ作成API
export async function createGroup(
  group: { name: string; emoji: string; color?: string },
  token?: string
): Promise<Group> {
  const res = await fetch("http://localhost:8000/groups", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(group),
  });

  if (!res.ok) {
    throw new Error("グループ作成に失敗しました");
  }
  
  console.log("グループ作成APIのレスポンス:", res);

  return await res.json();
}
