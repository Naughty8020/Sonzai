"use client";

import { useAtom } from "jotai";
import { activeGroupIdAtom, groupsAtom, showMobileMenuAtom, showModalAtom } from "../../store/groupAtoms";
import SidebarContent from "./SidebarContent";

export default function MobileSidebar() {
    const [activeGroupId, setActiveGroupId] = useAtom(activeGroupIdAtom);
    const [groups] = useAtom(groupsAtom);
    const [showMobileMenu, setShowMobileMenu] = useAtom(showMobileMenuAtom);
    const [, setShowModal] = useAtom(showModalAtom);

    const activeGroup = groups.find((g) => g.id === activeGroupId);

    const handleSelectGroup = (id: number) => {
      setActiveGroupId(id);
      setShowMobileMenu(false);
    };

    const handleOpenModal = () => {
      setShowMobileMenu(false);
      setShowModal(true);
    };

    if (!activeGroup) {
      return null;
    }
    
    return (
 
 
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

    );
}