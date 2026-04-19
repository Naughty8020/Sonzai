import { atom } from "jotai";

export type AuthMode = "login" | "register";

export const authModeAtom = atom<AuthMode>("login");
export const authEmailAtom = atom("");
export const authPasswordAtom = atom("");
export const authNameAtom = atom("");
export const authLoadingAtom = atom(false);
export const authErrorAtom = atom<string | null>(null);

// switchMode の挙動を atom 化: モード変更時に入力値とエラーを初期化する。
export const switchAuthModeAtom = atom(
	null,
	(_get, set, next: AuthMode) => {
		set(authModeAtom, next);
		set(authErrorAtom, null);
		set(authEmailAtom, "");
		set(authPasswordAtom, "");
		set(authNameAtom, "");
	}
);

export const resetAuthFormAtom = atom(null, (_get, set) => {
	set(authErrorAtom, null);
	set(authEmailAtom, "");
	set(authPasswordAtom, "");
	set(authNameAtom, "");
	set(authLoadingAtom, false);
});


