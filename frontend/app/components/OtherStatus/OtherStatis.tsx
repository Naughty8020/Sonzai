import { useAtomValue } from "jotai";
import { activeGroupAtom } from "@/app/store/groupAtoms";

type StatusType = "ok" | "busy" | "home" | "sleep" | "sos" | "out";



export default function OtherStatus() {
  const activeGroup = useAtomValue(activeGroupAtom);

  const statusStyles: Record<StatusType, { badge: string; dot: string }> = {
    ok:    { badge: "bg-green-100 text-green-800",   dot: "bg-green-500" },
    busy:  { badge: "bg-amber-100 text-amber-800",   dot: "bg-amber-500" },
    home:  { badge: "bg-blue-100 text-blue-800",     dot: "bg-blue-500" },
    sleep: { badge: "bg-purple-100 text-purple-800", dot: "bg-purple-500" },
    sos:   { badge: "bg-red-100 text-red-800",       dot: "bg-red-500" },
    out:   { badge: "bg-zinc-100 text-zinc-800",     dot: "bg-zinc-500" },
  };

  if (!activeGroup) {
    return null;
  }

  return (

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

    );
}