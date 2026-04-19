"use client";

import { useAtom, useSetAtom } from "jotai";
import type { StatusType } from "@/app/type/Status";
import { myStatusAtom, showToastAtom } from "@/app/store/groupAtoms";


const statusChips: { label: string; emoji: string; type: StatusType }[] = [
  { label: "元気", emoji: "😊", type: "ok" },
  { label: "在宅", emoji: "🏠", type: "home" },
  { label: "忙しい", emoji: "⚡", type: "busy" },
  { label: "外出中", emoji: "🚶", type: "out" },
  { label: "就寝", emoji: "😴", type: "sleep" },
  { label: "SOS", emoji: "🆘", type: "sos" },
];


export default function MyStatus() {
  const [myStatus, setMyStatus] = useAtom(myStatusAtom);
  const showToast = useSetAtom(showToastAtom);

  return (

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

  );
}
