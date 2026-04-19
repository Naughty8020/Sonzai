import { atom } from "jotai";
import { initialGroups } from "@/app/data/group";
import type { Group } from "@/app/type/Group";
import type { StatusType } from "@/app/type/Status";  


export const EMOJI_OPTIONS = ["🏠", "⭐", "💼", "🎮", "🎵", "📚", "🌸", "🍜", "🐶", "🏃", "🎨", "✈️"];

export const groupsAtom = atom<Group[]>(initialGroups);
export const activeGroupIdAtom = atom<number>(1);
export const showModalAtom = atom(false);

export const myStatusAtom = atom<StatusType>("home");
export const newGroupNameAtom = atom("");
export const selectedEmojiAtom = atom(EMOJI_OPTIONS[0]);
export const toastAtom = atom<string | null>(null);

let toastTimeout: ReturnType<typeof setTimeout> | null = null;

export const showToastAtom = atom(null, (_get, set, message: string) => {
  set(toastAtom, message);

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    set(toastAtom, null);
    toastTimeout = null;
  }, 2200);
});

export const activeGroupAtom = atom((get) => {
  const groups = get(groupsAtom);
  const activeId = get(activeGroupIdAtom);

  return groups.find((group) => group.id === activeId) ?? groups[0] ?? null;
});
