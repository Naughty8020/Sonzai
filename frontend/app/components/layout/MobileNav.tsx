import { useAtom } from "jotai";
import { activeGroupIdAtom, groupsAtom, showModalAtom } from "@/app/store/groupAtoms";

export default function MobileNav() {
  const [groups] = useAtom(groupsAtom);
  const [activeGroupId, setActiveGroupId] = useAtom(activeGroupIdAtom);
  const [, setShowModal] = useAtom(showModalAtom);

  return (
    <div>
    
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
              <span className="text-[10px] truncate max-w-13">{g.name}</span>
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
    );
    }
