"use client";

import { useEffect, type FormEvent } from "react";
import { useAtom, useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { hasAuthCookieInBrowser } from "@/lib/auth";
import { handleSubmit as handleAuthSubmit } from "@/app/api/auth";
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

  const handleSubmit = (e: FormEvent) =>
    handleAuthSubmit(e, {
      mode,
      name,
      email,
      password,
      setLoading,
      setError,
      onSuccess: () => router.replace("/"),
    });

  



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