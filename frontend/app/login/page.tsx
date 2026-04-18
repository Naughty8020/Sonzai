"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "register" && !name.trim()) {
      setError("お名前を入力してください");
      return;
    }
    if (!email.trim()) {
      setError("メールアドレスを入力してください");
      return;
    }
    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return;
    }

    setLoading(true);
    // TODO: 実際の認証処理に置き換える
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    router.push("/");
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
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

        {/* Tab switcher */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 mb-6">
          <button
            onClick={() => switchMode("login")}
            className={`flex-1 py-2 text-sm rounded-lg transition-colors font-medium ${
              mode === "login"
                ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            ログイン
          </button>
          <button
            onClick={() => switchMode("register")}
            className={`flex-1 py-2 text-sm rounded-lg transition-colors font-medium ${
              mode === "register"
                ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            新規登録
          </button>
        </div>

        {/* Form card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name — register only */}
            {mode === "register" && (
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">お名前</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="山田 太郎"
                  autoComplete="name"
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-colors"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-zinc-500">パスワード</label>
                {mode === "login" && (
                  <button
                    type="button"
                    className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
                  >
                    パスワードを忘れた方
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "8文字以上" : "••••••••"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-colors"
              />
              {mode === "register" && (
                <p className="text-[11px] text-zinc-400 mt-1.5">8文字以上で入力してください</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  {mode === "login" ? "ログイン中..." : "登録中..."}
                </>
              ) : (
                mode === "login" ? "ログイン" : "アカウントを作成"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
            <span className="text-[11px] text-zinc-400">または</span>
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
          </div>

          {/* Google OAuth — ボタンのみ、実装は別途 */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Googleで{mode === "login" ? "ログイン" : "登録"}
          </button>
        </div>

        {/* Footer note */}
        {mode === "register" && (
          <p className="text-center text-[11px] text-zinc-400 mt-4 leading-relaxed">
            登録することで
            <button className="text-indigo-500 hover:underline mx-0.5">利用規約</button>
            および
            <button className="text-indigo-500 hover:underline mx-0.5">プライバシーポリシー</button>
            に同意したものとみなします
          </p>
        )}
      </div>
    </div>
  );
}