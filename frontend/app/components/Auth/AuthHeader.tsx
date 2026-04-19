import type { AuthMode } from "@/app/store/authAtoms";

type AuthHeaderProps = {
  mode: AuthMode;
};

export default function AuthHeader({ mode }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mb-3">
        <svg className="w-6 h-6 fill-white" viewBox="0 0 16 16">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 10.25h-1.5v-4.5h1.5v4.5zm0-6h-1.5v-1.5h1.5v1.5z" />
        </svg>
      </div>
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">imhere</h1>
      <p className="text-sm text-zinc-400 mt-1">
        {mode === "login" ? "アカウントにログイン" : "新しいアカウントを作成"}
      </p>
    </div>
  );
}
