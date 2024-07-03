"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function DiscordSignInButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  return (
    <button
      className="w-full rounded-md border border-zinc-300 bg-white py-1 text-zinc-700"
      onClick={() => signIn("discord", { callbackUrl: callbackUrl })}
    >
      <span className="mr-2 text-red-700">G</span> Sign in with Discord
    </button>
  );
}
