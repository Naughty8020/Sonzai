import type { FormEvent } from "react";
import type { AuthMode } from "@/app/store/authAtoms";
import { setAuthCookie } from "@/lib/auth";

type HandleSubmitParams = {
  mode: AuthMode;
  name: string;
  email: string;
  password: string;
  setLoading: (loading: boolean) => void;
  setError: (message: string | null) => void;
  onSuccess: () => void;
};

export async function handleSubmit(e: FormEvent, params: HandleSubmitParams) {
  const { mode, name, email, password, setLoading, setError, onSuccess } = params;

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
    onSuccess();
  } catch {
    setError("サーバーに接続できませんでした");
  } finally {
    setLoading(false);
  }
}
