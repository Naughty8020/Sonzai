"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { authModeAtom, switchAuthModeAtom } from "@/app/store/authAtoms";

export default function AuthToggle() {
  const mode = useAtomValue(authModeAtom);
  const switchMode = useSetAtom(switchAuthModeAtom);

  return (
    <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 mb-6">
      <button
        onClick={() => switchMode("login")}
        className={`flex-1 py-2 text-sm rounded-lg transition-colors font-medium ${
          mode === "login"
            ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 shadow-sm"
            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        }`}
      >
        ログイン
      </button>
      <button
        onClick={() => switchMode("register")}
        className={`flex-1 py-2 text-sm rounded-lg transition-colors font-medium ${
          mode === "register"
            ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 shadow-sm"
            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        }`}
      >
        新規登録
      </button>
    </div>
  );
}
