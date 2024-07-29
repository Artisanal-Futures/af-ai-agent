import { create } from "domain";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { CiImport } from "react-icons/ci";
import { SessionDropDownMenu } from "~/app/(auth)/_components/session-dropdown-menu";
import { SignInButton } from "~/app/(auth)/_components/sign-in-button";
import { ImageGenerateCard } from "~/components/image-generate-card";
import { StyleTransferCard } from "~/components/style-transfer-card";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { VariationGenerateCard } from "~/components/variation-generate-card";
import { api } from "~/trpc/react";

type Props = {
  handleCloseCard: () => void;
  session: Session | null;
};

export const ImageHistoryCard = (props: Props) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <Card className="relative w-[60%] bg-white p-4">
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={props.handleCloseCard}
            className="text-gray-500 hover:text-gray-700"
          >
            &#x2715;
          </button>
        </div>
        <CardContent>
          <CardHeader>
            <CardTitle>Image Variations</CardTitle>
            <CardDescription className="text-lg">
              Here you can view your past created images.
            </CardDescription>
          </CardHeader>
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
        </CardContent>
      </Card>
    </div>
  );
};
