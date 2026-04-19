  
import { useAtom } from "jotai";
import type { Group } from "@/app/type/Group";

import {
  EMOJI_OPTIONS,
  activeGroupIdAtom,
  groupsAtom,
  newGroupNameAtom,
  selectedEmojiAtom,
  showModalAtom,
} from "@/app/store/groupAtoms";

export function useCreateGroup(onCreated?: (groupName: string) => void) {
  const [groups, setGroups] = useAtom(groupsAtom);
  const [, setActiveGroupId] = useAtom(activeGroupIdAtom);
  const [, setShowModal] = useAtom(showModalAtom);
  const [newGroupName, setNewGroupName] = useAtom(newGroupNameAtom);
  const [selectedEmoji, setSelectedEmoji] = useAtom(selectedEmojiAtom);

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

    setGroups([...groups, newGroup]);
    setActiveGroupId(newGroup.id);
    setNewGroupName("");
    setSelectedEmoji(EMOJI_OPTIONS[0]);
    setShowModal(false);
    onCreated?.(name);
  };

  return { handleCreateGroup };
}

