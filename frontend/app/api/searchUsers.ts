// app/api/searchUsers.ts

import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/users/search?name=${encodeURIComponent(name)}`
  );
  const users = await res.json();
  return new Response(JSON.stringify(users), { status: 200 });
}