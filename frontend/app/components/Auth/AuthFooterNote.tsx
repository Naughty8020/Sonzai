import type { AuthMode } from "@/app/store/authAtoms";

type AuthFooterNoteProps = {
  mode: AuthMode;
};

export default function AuthFooterNote({ mode }: AuthFooterNoteProps) {
  if (mode !== "register") {
    return null;
  }

  return (
    <p className="text-center text-[11px] text-zinc-400 mt-4 leading-relaxed">
      登録することで
      <button className="text-indigo-500 hover:underline mx-0.5">利用規約</button>
      および
      <button className="text-indigo-500 hover:underline mx-0.5">プライバシーポリシー</button>
      に同意したものとみなします
    </p>
  );
}
