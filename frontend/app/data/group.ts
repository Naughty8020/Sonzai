export type StatusType = "ok" | "busy" | "home" | "out" | "sleep" | "sos";

export interface Member {
  name: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  status: StatusType;
  statusLabel: string;
  statusEmoji: string;
  time: string;
}

export interface Group {
  id: number;
  name: string;
  emoji: string;
  color: string;
  members: Member[];
}

export const initialGroups: Group[] = [
  {
    id: 1, name: "家族", emoji: "🏠", color: "bg-purple-50",
    members: [
      { name: "お父さん", initials: "父", avatarBg: "bg-blue-100", avatarText: "text-blue-800", status: "ok", statusLabel: "元気", statusEmoji: "😊", time: "2分前" },
      { name: "お母さん", initials: "母", avatarBg: "bg-green-100", avatarText: "text-green-800", status: "busy", statusLabel: "忙しい", statusEmoji: "⚡", time: "15分前" },
      { name: "妹", initials: "妹", avatarBg: "bg-pink-100", avatarText: "text-pink-800", status: "sleep", statusLabel: "就寝", statusEmoji: "😴", time: "1時間前" },
      { name: "兄", initials: "兄", avatarBg: "bg-amber-100", avatarText: "text-amber-800", status: "home", statusLabel: "在宅", statusEmoji: "🏠", time: "5分前" },
    ],
  },
  {
    id: 2, name: "親友", emoji: "⭐", color: "bg-green-50",
    members: [
      { name: "さくら", initials: "さ", avatarBg: "bg-pink-100", avatarText: "text-pink-800", status: "ok", statusLabel: "元気", statusEmoji: "😊", time: "今" },
      { name: "けんた", initials: "け", avatarBg: "bg-purple-100", avatarText: "text-purple-800", status: "busy", statusLabel: "忙しい", statusEmoji: "⚡", time: "30分前" },
      { name: "みほ", initials: "み", avatarBg: "bg-green-100", avatarText: "text-green-800", status: "home", statusLabel: "在宅", statusEmoji: "🏠", time: "10分前" },
    ],
  },
  {
    id: 3, name: "職場", emoji: "💼", color: "bg-blue-50",
    members: [
      { name: "田中さん", initials: "田", avatarBg: "bg-blue-100", avatarText: "text-blue-800", status: "busy", statusLabel: "忙しい", statusEmoji: "⚡", time: "3分前" },
      { name: "鈴木さん", initials: "鈴", avatarBg: "bg-green-100", avatarText: "text-green-800", status: "ok", statusLabel: "元気", statusEmoji: "😊", time: "8分前" },
      { name: "伊藤さん", initials: "伊", avatarBg: "bg-amber-100", avatarText: "text-amber-800", status: "home", statusLabel: "在宅", statusEmoji: "🏠", time: "20分前" },
      { name: "佐藤さん", initials: "佐", avatarBg: "bg-purple-100", avatarText: "text-purple-800", status: "sleep", statusLabel: "就寝", statusEmoji: "😴", time: "2時間前" },
      { name: "高橋さん", initials: "高", avatarBg: "bg-pink-100", avatarText: "text-pink-800", status: "busy", statusLabel: "忙しい", statusEmoji: "⚡", time: "1分前" },
      { name: "山田さん", initials: "山", avatarBg: "bg-red-100", avatarText: "text-red-800", status: "sos", statusLabel: "SOS", statusEmoji: "🆘", time: "今" },
    ],
  },
  {
    id: 4, name: "趣味仲間", emoji: "🎮", color: "bg-amber-50",
    members: [
      { name: "りょう", initials: "り", avatarBg: "bg-amber-100", avatarText: "text-amber-800", status: "ok", statusLabel: "元気", statusEmoji: "😊", time: "5分前" },
      { name: "あかね", initials: "あ", avatarBg: "bg-pink-100", avatarText: "text-pink-800", status: "home", statusLabel: "在宅", statusEmoji: "🏠", time: "12分前" },
      { name: "そうた", initials: "そ", avatarBg: "bg-green-100", avatarText: "text-green-800", status: "busy", statusLabel: "忙しい", statusEmoji: "⚡", time: "45分前" },
      { name: "はな", initials: "は", avatarBg: "bg-purple-100", avatarText: "text-purple-800", status: "sleep", statusLabel: "就寝", statusEmoji: "😴", time: "3時間前" },
      { name: "たくや", initials: "た", avatarBg: "bg-blue-100", avatarText: "text-blue-800", status: "ok", statusLabel: "元気", statusEmoji: "😊", time: "今" },
    ],
  },
];