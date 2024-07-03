import { getProviders } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import { Suspense } from "react";
import ProviderSignInButton from "./_components/ProviderSignInButton";

export default async function SignIn() {
  const providers = await getProviders();

  return (
    <>
      <div className=" my-auto flex h-full w-full items-center gap-5 max-md:flex-col-reverse">
        <div className="justify-left flex lg:w-4/12">
          {" "}
          <div className="w-96 rounded bg-white p-4 ">
            <h1 className="mb-4 text-center text-2xl">
              Sign In to Artisanal Futures
            </h1>
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

              <div className="my-3 flex items-center px-3">
                <hr className="w-full border-slate-600" />
                <span className="mx-3 text-slate-500">or</span>
                <hr className="w-full border-slate-600" />
              </div>

              <div></div>
            </div>

            <p className="text-muted-foreground w-full py-4 text-center font-medium">
              Don&apos;t have an account?{" "}
              <Link href="https://artisanalfutures.org/sign-up">
                <span className="font-bold hover:text-slate-800">
                  Sign up here!
                </span>
              </Link>
            </p>
          </div>
        </div>
        <div className=" flex justify-end px-4  lg:w-8/12">
          <Image
            src="/img/sign-in.svg"
            alt="Sign in to Artisanal Futures"
            width={500}
            height={500}
          />
        </div>
      </div>
    </>
  );
}
