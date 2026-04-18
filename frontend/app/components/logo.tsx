// ── ロゴ部分も共通コンポーネントとして切り出し ──
export default function SidebarLogo() {
  return (
    <div className="px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 fill-white" viewBox="0 0 16 16">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 10.25h-1.5v-4.5h1.5v4.5zm0-6h-1.5v-1.5h1.5v1.5z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">imhere</span>
      </div>
    </div>
  );
}