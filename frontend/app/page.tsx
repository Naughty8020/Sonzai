"use client";

import { useState } from "react";

type StatusType = "ok" | "busy" | "home" | "out" | "sleep" | "sos";

interface Member {
  name: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  status: StatusType;
  statusLabel: string;
  statusEmoji: string;
  time: string;
}

interface Group {
  id: number;
  name: string;
  emoji: string;
  color: string;
  members: Member[];
}

const EMOJI_OPTIONS = ["🏠","⭐","💼","🎮","🎵","📚","🌸","🍜","🐶","🏃","🎨","✈️"];

const initialGroups: Group[] = [
  {
    id: 1, name: "家族", emoji: "🏠", color: "bg-purple-50",
    members: [
      { name: "お父さん", initials: "父", avatarBg: "bg-blue-100", avatarText: "text-blue-800", status: "ok", statusLabel: "元気", statusEmoji: "😊", time: "2分前" },
      { name: "お母さん", initials: "母", avatarBg: "bg-green-100", avatarText: "text-green-800", status: "busy", statusLabel: "忙しい", statusEmoji: "⚡", time: "15分前" },
      { name: "妹", initials: "妹", avatarBg: "bg-pink-100", avatarText: "text-pink-800", status: "sleep", statusLabel: "就寝", statusEmoji: "😴", time: "1時間前" },
      { name: "兄", initials: "兄", avatarBg: "bg-amber-100", avatarText: "text-amber-800", status: "home", statusLabel: "在宅", statusEmoji: "🏠", time: "5分前" },
    ],
  },
  {
    id: 2, name: "親友", emoji: "⭐", color: "bg-green-50",
    members: [
      { name: "さくら", initials: "さ", avatarBg: "bg-pink-100", avatarText: "text-pink-800", status: "ok", statusLabel: "元気", statusEmoji: "😊", time: "今" },
      { name: "けんた", initials: "け", avatarBg: "bg-purple-100", avatarText: "text-purple-800", status: "busy", statusLabel: "忙しい", statusEmoji: "⚡", time: "30分前" },
      { name: "みほ", initials: "み", avatarBg: "bg-green-100", avatarText: "text-green-800", status: "home", statusLabel: "在宅", statusEmoji: "🏠", time: "10分前" },
    ],
  },
  {
    id: 3, name: "職場", emoji: "💼", color: "bg-blue-50",
    members: [
      { name: "田中さん", initials: "田", avatarBg: "bg-blue-100", avatarText: "text-blue-800", status: "busy", statusLabel: "忙しい", statusEmoji: "⚡", time: "3分前" },
      { name: "鈴木さん", initials: "鈴", avatarBg: "bg-green-100", avatarText: "text-green-800", status: "ok", statusLabel: "元気", statusEmoji: "😊", time: "8分前" },
      { name: "伊藤さん", initials: "伊", avatarBg: "bg-amber-100", avatarText: "text-amber-800", status: "home", statusLabel: "在宅", statusEmoji: "🏠", time: "20分前" },
      { name: "佐藤さん", initials: "佐", avatarBg: "bg-purple-100", avatarText: "text-purple-800", status: "sleep", statusLabel: "就寝", statusEmoji: "😴", time: "2時間前" },
      { name: "高橋さん", initials: "高", avatarBg: "bg-pink-100", avatarText: "text-pink-800", status: "busy", statusLabel: "忙しい", statusEmoji: "⚡", time: "1分前" },
      { name: "山田さん", initials: "山", avatarBg: "bg-red-100", avatarText: "text-red-800", status: "sos", statusLabel: "SOS", statusEmoji: "🆘", time: "今" },
    ],
  },
  {
    id: 4, name: "趣味仲間", emoji: "🎮", color: "bg-amber-50",
    members: [
      { name: "りょう", initials: "り", avatarBg: "bg-amber-100", avatarText: "text-amber-800", status: "ok", statusLabel: "元気", statusEmoji: "😊", time: "5分前" },
      { name: "あかね", initials: "あ", avatarBg: "bg-pink-100", avatarText: "text-pink-800", status: "home", statusLabel: "在宅", statusEmoji: "🏠", time: "12分前" },
      { name: "そうた", initials: "そ", avatarBg: "bg-green-100", avatarText: "text-green-800", status: "busy", statusLabel: "忙しい", statusEmoji: "⚡", time: "45分前" },
      { name: "はな", initials: "は", avatarBg: "bg-purple-100", avatarText: "text-purple-800", status: "sleep", statusLabel: "就寝", statusEmoji: "😴", time: "3時間前" },
      { name: "たくや", initials: "た", avatarBg: "bg-blue-100", avatarText: "text-blue-800", status: "ok", statusLabel: "元気", statusEmoji: "😊", time: "今" },
    ],
  },
];

const statusChips: { label: string; emoji: string; type: StatusType }[] = [
  { label: "元気", emoji: "😊", type: "ok" },
  { label: "在宅", emoji: "🏠", type: "home" },
  { label: "忙しい", emoji: "⚡", type: "busy" },
  { label: "外出中", emoji: "🚶", type: "out" },
  { label: "就寝", emoji: "😴", type: "sleep" },
  { label: "SOS", emoji: "🆘", type: "sos" },
];

const statusStyles: Record<StatusType, { badge: string; dot: string }> = {
  ok:    { badge: "bg-green-100 text-green-800",   dot: "bg-green-500" },
  busy:  { badge: "bg-amber-100 text-amber-800",   dot: "bg-amber-500" },
  home:  { badge: "bg-blue-100 text-blue-800",     dot: "bg-blue-500" },
  sleep: { badge: "bg-purple-100 text-purple-800", dot: "bg-purple-500" },
  sos:   { badge: "bg-red-100 text-red-800",       dot: "bg-red-500" },
  out:   { badge: "bg-zinc-100 text-zinc-800",     dot: "bg-zinc-500" },
};

// ── SidebarContent をトップレベルコンポーネントとして定義 ──
interface SidebarContentProps {
  groups: Group[];
  activeGroupId: number;
  onSelectGroup: (id: number) => void;
  onOpenModal: () => void;
}

function SidebarContent({ groups, activeGroupId, onSelectGroup, onOpenModal }: SidebarContentProps) {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-2">
        <p className="text-[10px] uppercase tracking-widest text-zinc-400 px-2 pt-2 pb-1">
          グループ
        </p>
        {groups.map((g) => (
          <button
            key={g.id}
            onClick={() => onSelectGroup(g.id)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
              g.id === activeGroupId
                ? "bg-indigo-50 dark:bg-indigo-950"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <div className={`w-8 h-8 rounded-full ${g.color} flex items-center justify-center text-base shrink-0`}>
              {g.emoji}
            </div>
            <span className={`text-[13px] flex-1 truncate ${
              g.id === activeGroupId
                ? "font-medium text-indigo-800 dark:text-indigo-300"
                : "text-zinc-700 dark:text-zinc-300"
            }`}>
              {g.name}
            </span>
            <span className="text-[11px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full shrink-0">
              {g.members.length}
            </span>
          </button>
        ))}
      </div>
      <div className="p-2 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={onOpenModal}
          className="w-full flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-400 text-[13px] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.5 2.5h-1v5h-5v1h5v5h1v-5h5v-1h-5v-5z" />
          </svg>
          グループを追加
        </button>
      </div>
    </>
  );
}

// ── ロゴ部分も共通コンポーネントとして切り出し ──
function SidebarLogo() {
  return (
    <div className="px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 fill-white" viewBox="0 0 16 16">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 10.25h-1.5v-4.5h1.5v4.5zm0-6h-1.5v-1.5h1.5v1.5z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">imhere</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [activeGroupId, setActiveGroupId] = useState<number>(1);
  const [myStatus, setMyStatus] = useState<StatusType>("home");
  const [showModal, setShowModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[0]);
  const [toast, setToast] = useState<string | null>(null);

  const activeGroup = groups.find((g) => g.id === activeGroupId)!;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleSelectGroup = (id: number) => {
    setActiveGroupId(id);
    setShowMobileMenu(false);
  };

  const handleOpenModal = () => {
    setShowMobileMenu(false);
    setShowModal(true);
  };

  const handleCreateGroup = () => {
    const name = newGroupName.trim();
    if (!name) return;
    const newGroup: Group = {
      id: Date.now(),
      name,
      emoji: selectedEmoji,
      color: "bg-zinc-50",
      members: [],
    };
    setGroups((prev) => [...prev, newGroup]);
    setActiveGroupId(newGroup.id);
    setNewGroupName("");
    setSelectedEmoji(EMOJI_OPTIONS[0]);
    setShowModal(false);
    showToast(`「${name}」グループを作成しました`);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-100 dark:bg-zinc-900 font-sans">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-56 shrink-0 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex-col h-full">
        <SidebarLogo />
        <SidebarContent
          groups={groups}
          activeGroupId={activeGroupId}
          onSelectGroup={handleSelectGroup}
          onOpenModal={handleOpenModal}
        />
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col z-50 transition-transform duration-200 md:hidden ${
        showMobileMenu ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="px-4 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 fill-white" viewBox="0 0 16 16">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 10.25h-1.5v-4.5h1.5v4.5zm0-6h-1.5v-1.5h1.5v1.5z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">imhere</span>
          </div>
          <button
            onClick={() => setShowMobileMenu(false)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <SidebarContent
          groups={groups}
          activeGroupId={activeGroupId}
          onSelectGroup={handleSelectGroup}
          onOpenModal={handleOpenModal}
        />
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-50 dark:bg-zinc-900">

        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileMenu(true)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-[15px] font-medium text-zinc-900 dark:text-zinc-50">
                {activeGroup.emoji} {activeGroup.name}
              </h1>
              <p className="text-[12px] text-zinc-400">メンバー {activeGroup.members.length}人</p>
            </div>
          </div>
          <button
            onClick={() => showToast("招待リンクをコピーしました")}
            className="text-[12px] px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shrink-0"
          >
            + 招待
          </button>
        </div>

        {/* My status bar */}
        <div className="px-4 md:px-6 py-3 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2">
            自分のステータス
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {statusChips.map((chip) => (
              <button
                key={chip.type}
                onClick={() => {
                  setMyStatus(chip.type);
                  showToast(`ステータスを「${chip.label}」に更新しました`);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] border transition-colors shrink-0 ${
                  myStatus === chip.type
                    ? "bg-indigo-50 border-indigo-200 text-indigo-800 font-medium dark:bg-indigo-950 dark:border-indigo-700 dark:text-indigo-300"
                    : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300"
                }`}
              >
                <span className="text-sm leading-none">{chip.emoji}</span>
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Members */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <p className="text-[11px] text-zinc-400 mb-3 uppercase tracking-widest">
            メンバーのステータス
          </p>
          {activeGroup.members.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-zinc-400 gap-2">
              <span className="text-4xl">👥</span>
              <p className="text-sm">まだメンバーがいません</p>
              <p className="text-[12px]">「招待」ボタンからメンバーを追加しましょう</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 md:gap-3">
              {activeGroup.members.map((m) => {
                const s = statusStyles[m.status];
                return (
                  <div
                    key={m.name}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 md:p-3.5 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full ${m.avatarBg} ${m.avatarText} flex items-center justify-center text-[12px] md:text-[13px] font-medium shrink-0`}>
                        {m.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] md:text-[13px] font-medium text-zinc-900 dark:text-zinc-50 truncate">{m.name}</p>
                        <p className="text-[10px] md:text-[11px] text-zinc-400">{m.time}</p>
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-2.5 py-1 rounded-full text-[11px] md:text-[12px] ${s.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} shrink-0`} />
                      <span className="text-xs leading-none">{m.statusEmoji}</span>
                      {m.statusLabel}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Mobile bottom nav ── */}
        <nav className="md:hidden shrink-0 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around px-2 py-2">
          {groups.slice(0, 4).map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGroupId(g.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                g.id === activeGroupId
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              <span className="text-xl leading-none">{g.emoji}</span>
              <span className="text-[10px] truncate max-w-[52px]">{g.name}</span>
            </button>
          ))}
          <button
            onClick={() => setShowModal(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <span className="text-xl leading-none">＋</span>
            <span className="text-[10px]">追加</span>
          </button>
        </nav>
      </div>

      {/* ── Create group modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6 w-full sm:w-80">
            <h2 className="text-[15px] font-medium text-zinc-900 dark:text-zinc-50 mb-5">
              新しいグループを作成
            </h2>
            <label className="block text-[12px] text-zinc-500 mb-1.5">グループ名</label>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
              placeholder="例：大学の友達"
              maxLength={20}
              autoFocus
              className="w-full px-3 py-2 text-[13px] rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 mb-4 transition-colors"
            />
            <label className="block text-[12px] text-zinc-500 mb-2">アイコンを選ぶ</label>
            <div className="flex flex-wrap gap-2 mb-6">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => setSelectedEmoji(e)}
                  className={`w-10 h-10 rounded-lg border text-xl flex items-center justify-center transition-colors ${
                    selectedEmoji === e
                      ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setShowModal(false); setNewGroupName(""); }}
                className="px-4 py-2 text-[13px] rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim()}
                className="px-4 py-2 text-[13px] rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                作成する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-5 right-4 md:right-5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] px-4 py-2.5 rounded-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}