import { getProviders } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import { redirect } from "next/navigation";
import { Suspense } from "react";
import { env } from "~/env";
import ErrorText from "./_components/ErrorText";
import ProviderSignInButton from "./_components/ProviderSignInButton";

const HOST_URL = `${env.NODE_ENV === "production" ? "https" : "http"}://${env.HOSTNAME}/sign-up`;

export default async function SignUp() {
  if (env.NODE_ENV === "production") {
    redirect(HOST_URL);
  }
  const providers = await getProviders();

  // If the node environment is production, redirect to https://artisanalfutures.org

  return (
    <>
      <div className=" my-auto flex h-full w-full items-center gap-5 max-md:flex-col-reverse">
        <div className="justify-left flex lg:w-4/12">
          <div className="w-96 rounded-lg border bg-white p-8 shadow">
            <Suspense fallback={<div>Loading...</div>}>
              <ErrorText />
            </Suspense>
            <h1 className="mb-4 text-center text-3xl font-semibold">
              Sign Up for Artisanal Futures
            </h1>
            <p className="text-muted-foreground text-center">
              Sign into your platform of choice to create an account.
            </p>
            <br />
            <div className="flex flex-col gap-y-2">
              <Suspense fallback={<div>Loading...</div>}>
                {providers &&
                  Object.values(providers).map((provider) => {
                    if (provider.name !== "Auth0") {
                      return (
                        <ProviderSignInButton
                          id={provider.id}
                          name={provider.name}
                          key={provider.name}
                        />
                      );
                    }
                  })}
              </Suspense>
            </div>
          </div>
        </div>
        <div className=" flex justify-end px-4  lg:w-8/12">
          <Image
            src="/img/sign-up.svg"
            alt="under development"
            width={500}
            height={500}
          />
        </div>
      </div>
    </>
  );
}
