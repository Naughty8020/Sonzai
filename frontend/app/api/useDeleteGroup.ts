import { useSetAtom, useAtomValue } from "jotai";
import { groupsAtom, activeGroupIdAtom, showToastAtom } from "@/app/store/groupAtoms";
import { deleteGroup } from "@/app/api/deleteGroup";
import { fetchGroups } from "@/app/api/fetchGroups";

export function useDeleteGroup() {
  const setGroups = useSetAtom(groupsAtom);
  const activeGroupId = useAtomValue(activeGroupIdAtom);
  const showToast = useSetAtom(showToastAtom);

  const handleDeleteGroup = async (groupId: number) => {
    if (!window.confirm("本当にこのグループを削除しますか？")) return;
    try {
      await deleteGroup(groupId);
      const updated = await fetchGroups();
      setGroups(updated);
      showToast("グループを削除しました");
    } catch (e) {
      showToast("グループ削除に失敗しました");
    }
  };

  return { handleDeleteGroup };
}
