"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function ProviderSignInButton(props: {
  id: string;
  name: string;
  signUp?: boolean;
}) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  return (
    <button
      className="ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      onClick={() => signIn(props.id, { callbackUrl: callbackUrl })}
    >
      <Image
        src={`/img/${props.id}.svg`}
        width={25}
        height={25}
        alt={props.name}
      />
      Sign {props?.signUp ? "up" : "in"} with {props.name}
    </button>
  );
}
