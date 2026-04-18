"use client";

import { useAtom } from "jotai";
import {
  EMOJI_OPTIONS,
  newGroupNameAtom,
  selectedEmojiAtom,
  showModalAtom,
} from "@/app/store/groupAtoms";
import { useCreateGroup } from "@/app/api/create";

interface CreateGroupProps {
  onCreated?: (groupName: string) => void;
}

export default function CreateGroup({ onCreated }: CreateGroupProps) {
  const [showModal, setShowModal] = useAtom(showModalAtom);
  const [newGroupName, setNewGroupName] = useAtom(newGroupNameAtom);
  const [selectedEmoji, setSelectedEmoji] = useAtom(selectedEmojiAtom);
  const { handleCreateGroup } = useCreateGroup(onCreated);


  if (!showModal) {
    return null;
  }

  const closeModal = () => {
    setShowModal(false);
    setNewGroupName("");
  };

  return (
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
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setSelectedEmoji(emoji)}
              className={`w-10 h-10 rounded-lg border text-xl flex items-center justify-center transition-colors ${
                selectedEmoji === emoji
                  ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950"
                  : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={closeModal}
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
  );
}
