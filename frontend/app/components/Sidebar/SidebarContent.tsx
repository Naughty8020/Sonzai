"use client";

import type { Group } from "@/app/type/Group";

// ── SidebarContent をトップレベルコンポーネントとして定義 ──
interface SidebarContentProps {
  groups: Group[];
  activeGroupId: number;
  onSelectGroup: (id: number) => void;
  onOpenModal: () => void;
}


export default function SidebarContent({ groups, activeGroupId, onSelectGroup, onOpenModal }: SidebarContentProps) {
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