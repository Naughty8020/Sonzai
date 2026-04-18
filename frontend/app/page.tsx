"use client";

import { useAtomValue, useSetAtom } from "jotai";
import MobileNav from "./components/layout/MobileNav";

import Header from "./components/layout/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import OtherStatus from "./components/OtherStatus/OtherStatis";
import MyStatus from "./components/Status/MyStatus";
import CreateGroup from "./components/CreateGroup/CreateGroup";
import {
  showMobileMenuAtom,
  showToastAtom,
  toastAtom,
} from "./store/groupAtoms";

export default function Home() {
  const showMobileMenu = useAtomValue(showMobileMenuAtom);
  const setShowMobileMenu = useSetAtom(showMobileMenuAtom);
  const showToast = useSetAtom(showToastAtom);
  const toast = useAtomValue(toastAtom);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-100 dark:bg-zinc-900 font-sans">
    <Sidebar /> 
      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-50 dark:bg-zinc-900">

      <Header /> 
        <MyStatus />
        <OtherStatus />
        <MobileNav />

   
      </div>

    
      <CreateGroup onCreated={(name) => showToast(`「${name}」グループを作成しました`)} />

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-5 right-4 md:right-5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] px-4 py-2.5 rounded-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}