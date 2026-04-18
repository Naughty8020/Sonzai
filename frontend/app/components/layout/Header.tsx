"use client";

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { activeGroupAtom, showToastAtom } from "@/app/store/groupAtoms";
import { clearAuthCookie } from "@/lib/auth";

export default function Header() {
  const activeGroup = useAtomValue(activeGroupAtom);
  const showToast = useSetAtom(showToastAtom);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    if (!activeGroup) {
      return null;
    }

    const handleLogout = () => {
      clearAuthCookie();
      showToast("ログアウトしました");
      setIsUserMenuOpen(false);
    };

    const handleProfile = () => {
      showToast("プロフィール変更は準備中です");
      setIsUserMenuOpen(false);
    };

    const handleSettings = () => {
      showToast("設定は準備中です");
      setIsUserMenuOpen(false);
    };

    return (
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-[15px] font-medium text-zinc-900 dark:text-zinc-50">
                {activeGroup.emoji} {activeGroup.name}
              </h1>
              <p className="text-[12px] text-zinc-400">メンバー {activeGroup.members.length}人</p>
            </div>
          </div>
          <div className="relative flex items-center gap-2 shrink-0">
            <button
              onClick={() => showToast("招待リンクをコピーしました")}
              className="text-[12px] px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              + 招待
            </button>
            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-100 flex items-center justify-center text-[12px] font-medium"
              aria-label="ユーザーメニュー"
            >
              U
            </button>

            {isUserMenuOpen && (
              <div className="absolute top-10 right-0 w-44 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg z-50 overflow-hidden">
                <button
                  onClick={handleProfile}
                  className="w-full text-left px-3 py-2.5 text-[13px] text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  プロフィール変更
                </button>
                <button
                  onClick={handleSettings}
                  className="w-full text-left px-3 py-2.5 text-[13px] text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  設定
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                >
                  ログアウト
                </button>
              </div>
            )}
          </div>
        </div>


    );
}