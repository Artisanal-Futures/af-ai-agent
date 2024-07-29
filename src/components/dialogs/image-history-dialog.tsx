import type { Session } from "next-auth";
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

export function ImageHistoryDialog(props: { session: Session | null }) {
  return (
    <Dialog>
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

        <div className="mt-4 grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="flex h-32 items-center justify-center border border-gray-300 bg-gray-200"
            >
              <span className="text-gray-500">No Image</span>
            </div>
          ))}
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
