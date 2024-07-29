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

export function PastPromptsDialog(props: { session: Session | null }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-sm-black rounded-lg bg-gray-200 px-3 py-1 hover:bg-gray-300"
        >
          Prompt History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[60%]">
        <DialogHeader>
          <DialogTitle>Past Prompts</DialogTitle>
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
              <div>Past Prompts for: {props.session.user.name}</div>
              {/* Render past prompts here */}
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
