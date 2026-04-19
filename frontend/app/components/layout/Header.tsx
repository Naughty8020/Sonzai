import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";
import { activeGroupAtom, showToastAtom, groupsAtom } from "@/app/store/groupAtoms";
import { clearAuthCookie } from "@/lib/auth";
import { fetchGroups } from "@/app/api/fetchGroups";

type UserCandidate = {
  id: string;
  name: string;
  avatar?: string;
};

const AVATAR_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-800" },
  { bg: "bg-green-100", text: "text-green-800" },
  { bg: "bg-pink-100", text: "text-pink-800" },
  { bg: "bg-purple-100", text: "text-purple-800" },
  { bg: "bg-amber-100", text: "text-amber-800" },
  { bg: "bg-red-100", text: "text-red-800" },
];

function pickAvatarColor(name: string) {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export default function Header() {
  const activeGroup = useAtomValue(activeGroupAtom);
  const showToast = useSetAtom(showToastAtom);
  const setGroups = useSetAtom(groupsAtom);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [candidates, setCandidates] = useState<UserCandidate[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<UserCandidate | null>(null);
  const inviteInputRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const searchUsers = useCallback(async (name: string) => {
    if (!name.trim()) { setCandidates([]); return; }
    setIsSearching(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/users/search?name=${encodeURIComponent(name.trim())}`
      );
      const users: UserCandidate[] = await res.json();
      setCandidates(users);
    } catch {
      setCandidates([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  if (!activeGroup) return null;

  const handleLogout = () => {
    clearAuthCookie();
    showToast("ログアウトしました");
    setIsUserMenuOpen(false);
    router.push("/login");
  };

  const handleInviteOpen = () => {
    setIsInviteOpen(true);
    setTimeout(() => inviteInputRef.current?.focus(), 100);
  };

  const handleInviteClose = () => {
    setIsInviteOpen(false);
    setInviteInput("");
    setCandidates([]);
    setSelectedCandidate(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInviteInput(value);
    setSelectedCandidate(null);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => searchUsers(value), 300);
  };

  const handleSelectCandidate = (user: UserCandidate) => {
    setSelectedCandidate(user);
    setInviteInput(user.name);
    setCandidates([]);
  };

  const handleInvite = async () => {
    const user = selectedCandidate;
    if (!user) { showToast("ユーザーを選択してください"); return; }
    setIsInviting(true);
    try {
      const color = pickAvatarColor(user.name);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/groups/${activeGroup.id}/members`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.name,
            initial: user.name.charAt(0),
            avatarBg: color.bg,
            avatarText: color.text,
            status: "ok",
          }),
        }
      );
      if (!res.ok) throw new Error();
      showToast("メンバーを追加しました");
      handleInviteClose();
      fetchGroups().then(setGroups).catch(() => {});
    } catch {
      showToast("招待に失敗しました");
    } finally {
      setIsInviting(false);
    }
  };

  const handleProfile = () => { showToast("プロフィール変更は準備中です"); setIsUserMenuOpen(false); };
  const handleSettings = () => { showToast("設定は準備中です"); setIsUserMenuOpen(false); };

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
          onClick={handleInviteOpen}
          className="text-[12px] px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          + 招待
        </button>

        {isInviteOpen && (
          <div className="absolute top-12 right-12 w-72 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg z-50 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={inviteInputRef}
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-[13px] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="ユーザー名を入力"
                  value={inviteInput}
                  onChange={handleInputChange}
                  onKeyDown={e => { if (e.key === "Enter") handleInvite(); }}
                  disabled={isInviting}
                  autoComplete="off"
                />
                {isSearching && (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">
                    検索中…
                  </span>
                )}
              </div>
              <button
                onClick={handleInvite}
                className="px-3 py-2 rounded-lg bg-blue-500 text-white text-[13px] hover:bg-blue-600 disabled:opacity-60 transition-colors"
                disabled={isInviting || !selectedCandidate}
              >
                招待
              </button>
              <button
                onClick={handleInviteClose}
                className="px-2 py-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-100 transition-colors"
                disabled={isInviting}
                aria-label="閉じる"
              >
                ×
              </button>
            </div>

            {selectedCandidate && (
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                <div className="w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-700 flex items-center justify-center text-[10px] font-semibold text-blue-700 dark:text-blue-200 shrink-0">
                  {selectedCandidate.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-[12px] text-blue-700 dark:text-blue-300 font-medium truncate">
                  {selectedCandidate.name}
                </span>
                <button
                  onClick={() => { setSelectedCandidate(null); setInviteInput(""); inviteInputRef.current?.focus(); }}
                  className="ml-auto text-blue-400 hover:text-blue-600 dark:hover:text-blue-200 text-[11px]"
                  aria-label="選択解除"
                >
                  ×
                </button>
              </div>
            )}

            {candidates.length > 0 && !selectedCandidate && (
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[10px] text-zinc-400 px-1">候補</span>
                <ul className="flex flex-col rounded-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                  {candidates.map((user, i) => (
                    <li key={user.id}>
                      <button
                        onClick={() => handleSelectCandidate(user)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${
                          i !== 0 ? "border-t border-zinc-100 dark:border-zinc-800" : ""
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[13px] text-zinc-800 dark:text-zinc-100 truncate">
                          {user.name}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!isSearching && inviteInput.trim() && candidates.length === 0 && !selectedCandidate && (
              <p className="text-[11px] text-zinc-400 text-center py-1">
                ユーザーが見つかりません
              </p>
            )}

            <span className="text-[11px] text-zinc-400">ユーザー名で招待します</span>
          </div>
        )}

        <button
          onClick={() => setIsUserMenuOpen(prev => !prev)}
          className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-100 flex items-center justify-center text-[12px] font-medium"
          aria-label="ユーザーメニュー"
        >
          U
        </button>
        {isUserMenuOpen && (
          <div className="absolute top-10 right-0 w-44 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg z-50 overflow-hidden">
            <button onClick={handleProfile} className="w-full text-left px-3 py-2.5 text-[13px] text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              プロフィール変更
            </button>
            <button onClick={handleSettings} className="w-full text-left px-3 py-2.5 text-[13px] text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              設定
            </button>
            <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
              ログアウト
            </button>
          </div>
        )}
      </div>
    </div>
  );
}