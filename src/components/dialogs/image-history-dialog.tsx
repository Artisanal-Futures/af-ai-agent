import type { Session } from "next-auth";
import Image from "next/image";
import { useState } from "react";
import { SessionDropDownMenu } from "~/app/(auth)/_components/session-dropdown-menu";
import { SignInButton } from "~/app/(auth)/_components/sign-in-button";
import { Button } from "~/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { env } from "~/env";
import { api } from "~/trpc/react";
import { ScrollArea } from "../ui/scroll-area";

export function ImageHistoryDialog(props: { session: Session | null }) {
  const [open, setOpen] = useState(false);

  const fetchPastVariations = api.agent.listVariations.useQuery(
    {
      user_id: props.session?.user.id ?? "",
    },
    {
      enabled: !!props.session?.user.id && open,
    },
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-sm-black rounded-lg bg-gray-200 px-3 py-1 hover:bg-gray-300"
        >
          Image Variations
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[60%]">
        <DialogHeader>
          <DialogTitle>Image Variations</DialogTitle>
          <DialogDescription className="text-lg">
            Here you can view your past created images.
          </DialogDescription>
        </DialogHeader>

        <div className="ml-6 mt-4 grid grid-cols-1 gap-4">
          {/* Column Labels */}
          <div className="grid grid-cols-3 gap-4 border-b border-gray-300 pb-2">
            <div className="text-lg font-semibold">Project</div>
            <div className="text-lg font-semibold">Base</div>
            <div className="text-lg font-semibold">Result</div>
          </div>

          <ScrollArea className="h-full max-h-[600px] w-full rounded-md border p-4">
            {fetchPastVariations?.data &&
            fetchPastVariations?.data?.length > 0 ? (
              fetchPastVariations?.data?.map((generation, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 border border-gray-300 bg-gray-200 p-4"
                >
                  <div className="flex flex-col justify-center">
                    <h3 className="text-lg font-semibold">
                      {generation.project_title}
                    </h3>
                    <p>{generation.guidance_prompt}</p>
                    <p className="text-sm text-gray-500">
                      Generated on:{" "}
                      {new Date(generation.generation_date).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative mt-7 flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100">
                      {generation.input_image_url ? (
                        <Image
                          src={`${env.NEXT_PUBLIC_BACKEND_URL}${generation.input_image_url}`}
                          alt={`Base: ${generation.project_title}`}
                          className="h-full w-full"
                          fill={true}
                        />
                      ) : (
                        <span className="text-gray-500">No Base Image</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative mt-7 flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100">
                      {generation.output_image_url ? (
                        <Image
                          src={`${env.NEXT_PUBLIC_BACKEND_URL}${generation.output_image_url}`}
                          alt={`Variation: ${generation.project_title}`}
                          className="h-full w-full"
                          fill={true}
                        />
                      ) : (
                        <span className="text-gray-500">No Result Image</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-3 gap-4 p-4">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-gray-500">No Project</span>
                </div>
                <div className="flex items-center justify-center">
                  <div className="mt-7 flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100">
                    <span className="text-gray-500">No Base Image</span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="mt-7 flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100">
                    <span className="text-gray-500">No Result Image</span>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
        <SessionDropDownMenu
          hasSession={!!props.session}
          sessionData={props.session}
        />
        {props.session ? (
          <>
            <div className="mt-3">Images for: {props.session.user.name}</div>
            {/* Render past prompts here */}
          </>
        ) : (
          <div>
            <div className="mt-3">
              Login to save your work
              <SignInButton className="ml-4" hasSession={!!props.session} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
