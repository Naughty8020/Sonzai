  
import { useAtom } from "jotai";
import type { Group } from "@/app/type/Group";
import { createGroup as createGroupApi } from "./createGroup";
import { fetchGroups } from "./fetchGroups";

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


  const handleCreateGroup = async () => {
    const name = newGroupName.trim();
    if (!name) return;

    try {
      await createGroupApi({
        name,
        emoji: selectedEmoji,
        color: "bg-zinc-50",
      });
      // グループ作成後に最新のグループ一覧を取得
      const updatedGroups = await fetchGroups();
      setGroups(updatedGroups);
      // 新しく作成したグループをactiveに
      const created = updatedGroups.find(g => g.name === name);
      if (created) setActiveGroupId(created.id);
      setNewGroupName("");
      setSelectedEmoji(EMOJI_OPTIONS[0]);
      setShowModal(false);
      onCreated?.(name);
    } catch (e) {
      alert("グループ作成に失敗しました");
    }
  };

  return { handleCreateGroup };
}

