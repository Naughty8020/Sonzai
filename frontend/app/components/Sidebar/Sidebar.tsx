"use client";1

import SidebarContent from "./SidebarContent";
import SidebarLogo from "../logo";
import { useAtom } from "jotai";
import { activeGroupIdAtom, groupsAtom, showModalAtom } from "@/app/store/groupAtoms";
import { useEffect } from "react";
import { fetchGroups } from "@/app/api/fetchGroups";
 

export default function Sidebar() {
  const [groups, setGroups] = useAtom(groupsAtom);
  const [activeGroupId, setActiveGroupId] = useAtom(activeGroupIdAtom);
  const [, setShowModal] = useAtom(showModalAtom);

  useEffect(() => {
    fetchGroups().then(setGroups).catch(() => {});
  }, [setGroups]);

  const handleSelectGroup = (id: number) => {
    setActiveGroupId(id);
  };
  const handleOpenModal = () => {
    setShowModal(true);
  };

  return (
    <aside className="hidden md:flex w-56 shrink-0 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex-col h-full">
      <SidebarLogo />
      <SidebarContent
        groups={groups}
        activeGroupId={activeGroupId}
        onSelectGroup={handleSelectGroup}
        onOpenModal={handleOpenModal}
      />
    </aside>
  );
}
