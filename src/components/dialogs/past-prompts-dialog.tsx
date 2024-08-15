import type { Session } from "next-auth";
import Image from "next/image";
import { useState } from "react";
import { SessionDropDownMenu } from "~/app/(auth)/_components/session-dropdown-menu";
import { SignInButton } from "~/app/(auth)/_components/sign-in-button";
import { Button } from "~/components/ui/button";
import { ImagePreview } from "../image-preview";

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

export function PastPromptsDialog(props: {
  session: Session | null;
  demo?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const fetchPastGenerations = api.agent.listGenerations.useQuery(
    { user_id: props.session?.user.id ?? "", demo: props?.demo },
    { enabled: !!props.session?.user.id && open },
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-sm-black rounded-lg bg-gray-200 px-3 py-1 hover:bg-gray-300"
        >
          Prompt Generations
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[60%]">
        <DialogHeader>
          <DialogTitle>Past Generations</DialogTitle>
          <DialogDescription className="text-lg">
            Here you can view your previous prompts.
          </DialogDescription>
        </DialogHeader>

        <div className="ml-6 mr-6">
          <SessionDropDownMenu
            hasSession={!!props.session}
            sessionData={props.session}
          />
          {props.session ? (
            <>
              <div>Past Generations for: {props.session.user.name}</div>
              {/* Container for past prompts/images */}

              <ScrollArea className="mt-4 h-full max-h-96 w-full ">
                <>
                  {fetchPastGenerations?.data &&
                    fetchPastGenerations?.data?.length > 0 ? (
                    <ul>
                      {fetchPastGenerations?.data?.map((generation, index) => (
                        <li key={index} className="mb-4">
                          <div className="flex flex-col items-start md:flex-row md:items-center">
                            <div className="relative mb-4 mr-4 aspect-square h-32 w-32  object-fill md:mb-0">
                              {generation.image_url ? (
                                <Image
                                  src={`${env.NEXT_PUBLIC_BACKEND_URL}${generation.image_url}`}
                                  alt={generation.project_title}
                                  className="h-full w-full"
                                  fill={true}
                                />
                              ) : (
                                <ImagePreview
                                  isPending={false}
                                  imageUrl=""
                                  title={generation.project_title || "Generation"}
                                />
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">
                                {generation.project_title}
                              </h3>
                              <p>{generation.prompt}</p>
                              <p className="text-sm text-gray-500">
                                Generated on:{" "}
                                {new Date(
                                  generation.generation_date,
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>No past generations available.</div>
                  )}
                </>
              </ScrollArea>
            </>
          ) : (
            <div>
              <div>
                Login to save your work
                <SignInButton className="ml-4" hasSession={!!props.session} />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
