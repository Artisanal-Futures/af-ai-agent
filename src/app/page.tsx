"use client";

import { useSession } from "next-auth/react";

import { ImageGenerateCard } from "~/components/cards/image-generate-card";

import { useLocalStorage } from "@uidotdev/usehooks";
import { StyleTransferCard } from "~/components/cards/style-transfer-card";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";

import { VariationGenerateCard } from "~/components/cards/variation-generate-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { Code } from "lucide-react";

import { ImageHistoryDialog } from "~/components/dialogs/image-history-dialog";
import { PastPromptsDialog } from "~/components/dialogs/past-prompts-dialog";
import { StyleHistoryDialog } from "~/components/dialogs/style-history-dialog";
import { Toggle } from "~/components/ui/toggle";
import { SessionDropDownMenu } from "./(auth)/_components/session-dropdown-menu";
import { SignInButton } from "./(auth)/_components/sign-in-button";

export default function Home() {
  const { data: session } = useSession();

  const [demo, setDemo] = useLocalStorage<boolean>("demo", false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ffffff] to-[#e5e7eb] text-black">
      {/* Menu */}
      <div className="z-100 fixed left-0 right-0 top-0 mb-5 flex w-full items-center justify-between bg-white px-4 py-2 shadow-md">
        <div className="flex items-center space-x-4">
          {/* Profile Pic and info */}
          <SignInButton hasSession={!!session} />
          <SessionDropDownMenu hasSession={!!session} sessionData={session} />
          {/* Replace with user name*/}

          <span className="text-lg font-semibold">
            Hi, {session?.user?.name ?? "user!"}{" "}
            {!session && " Login to save your work"}
          </span>
        </div>
        <div className="flex space-x-4">
          <HoverCard>
            <HoverCardTrigger asChild>
              <PastPromptsDialog session={session ?? null} demo={demo} />
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-center text-sm">
                View your past generation requests
              </p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <ImageHistoryDialog session={session ?? null} demo={demo} />
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-center text-sm">
                View images you have created
              </p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <StyleHistoryDialog session={session ?? null} demo={demo} />
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-center text-sm">
                Upload and save styles to use in style transfers
              </p>
            </HoverCardContent>
          </HoverCard>

          {/* On toggle, set to demo mode in local storage */}
          <Toggle
            aria-label="Toggle demo mode"
            defaultPressed={demo}
            onPressedChange={(pressed) => setDemo(pressed)}
          >
            <Code className="mr-2 h-4 w-4" />
            Demo Mode {demo ? "ON" : "OFF"}
          </Toggle>
        </div>
      </div>
      <h1 className="mt-16 text-5xl font-bold md:mt-16">
        Artisanal&apos;s AI Agent
      </h1>
      <div className="container flex h-[calc(100%-5rem)] flex-col items-center justify-center gap-12 px-4 py-12">
        <Tabs defaultValue="generate" className="h-[auto] w-[90%]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">Generate Image</TabsTrigger>
            <TabsTrigger value="variation">Create Variations</TabsTrigger>
            <TabsTrigger value="style_transfer">Style Transfer</TabsTrigger>
          </TabsList>

          {/*Generate Image Tab */}
          <TabsContent value="generate">
            <ImageGenerateCard userId={session?.user?.id} demo={demo} />
          </TabsContent>
          {/* Create Variation Tab*/}
          <TabsContent value="variation">
            <VariationGenerateCard userId={session?.user?.id} demo={demo} />
          </TabsContent>

          {/*Style Transfer Tab */}
          <TabsContent value="style_transfer">
            <StyleTransferCard userId={session?.user?.id} demo={demo} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
