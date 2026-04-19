"use client";

import { useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { hasAuthCookieInBrowser, setAuthCookie } from "@/lib/auth";
import AuthToggle from "@/app/components/Auth/toggle";
import AuthHeader from "@/app/components/Auth/AuthHeader";
import AuthFormCard from "@/app/components/Auth/AuthFormCard";
import AuthFooterNote from "@/app/components/Auth/AuthFooterNote";
import {
  authEmailAtom,
  authErrorAtom,
  authLoadingAtom,
  authModeAtom,
  authNameAtom,
  authPasswordAtom,
} from "@/app/store/authAtoms";

export default function LoginPage() {
  const router = useRouter();
  const mode = useAtomValue(authModeAtom);
  const [email, setEmail] = useAtom(authEmailAtom);
  const [password, setPassword] = useAtom(authPasswordAtom);
  const [name, setName] = useAtom(authNameAtom);
  const [loading, setLoading] = useAtom(authLoadingAtom);
  const [error, setError] = useAtom(authErrorAtom);

  useEffect(() => {
    if (hasAuthCookieInBrowser()) {
      router.replace("/");
    }
  }, [router]);

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
    try {
      const baseUrl = "http://localhost:8000";
      const endpoint = mode === "register" ? "/auth/register" : "/auth/login";

      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          ...(mode === "register" ? { name: name.trim() } : {}),
        }),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          (payload && typeof payload.detail === "string" && payload.detail) ||
          (mode === "register" ? "新規登録に失敗しました" : "ログインに失敗しました");
        setError(message);
        return;
      }

      const token =
        (payload && typeof payload.access_token === "string" && payload.access_token) ||
        (payload && typeof payload.token === "string" && payload.token) ||
        null;

      if (!token) {
        setError("認証トークンの取得に失敗しました");
        return;
      }

      setAuthCookie(token);
      router.replace("/");
    } catch {
      setError("サーバーに接続できませんでした");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        <AuthHeader mode={mode} />
        <AuthToggle />
        <AuthFormCard
          mode={mode}
          name={name}
          email={email}
          password={password}
          loading={loading}
          error={error}
          onNameChange={(value) => setName(value)}
          onEmailChange={(value) => setEmail(value)}
          onPasswordChange={(value) => setPassword(value)}
          onSubmit={handleSubmit}
        />
        <AuthFooterNote mode={mode} />
      </div>
    </div>
  );
}