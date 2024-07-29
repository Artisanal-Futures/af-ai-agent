"use client";

import { useSession } from "next-auth/react";

import { ImageGenerateCard } from "~/components/image-generate-card";

import { StyleTransferCard } from "~/components/style-transfer-card";
import { Button } from "~/components/ui/button";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { VariationGenerateCard } from "~/components/variation-generate-card";

import { ImageHistoryDialog } from "~/components/dialogs/image-history-dialog";
import { PastPromptsDialog } from "~/components/dialogs/past-propmpts-dialog";
import { SessionDropDownMenu } from "./(auth)/_components/session-dropdown-menu";
import { SignInButton } from "./(auth)/_components/sign-in-button";

export default function Home() {
  const { data: session } = useSession();

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
              <PastPromptsDialog session={session ?? null} />
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-center text-sm">
                View your past generation requests
              </p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <ImageHistoryDialog session={session ?? null} />
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-center text-sm">
                View images you have created
              </p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Button className="text-sm-black rounded-lg bg-gray-200 px-3 py-1 hover:bg-gray-300">
                Image Descriptions
              </Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-center text-sm">
                View image descriptions of past creations
              </p>
            </HoverCardContent>
          </HoverCard>
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
            <ImageGenerateCard userId={session?.user?.id} />
          </TabsContent>
          {/* Create Variation Tab*/}
          <TabsContent value="variation">
            <VariationGenerateCard userId={session?.user?.id} />
          </TabsContent>

          {/*Style Transfer Tab */}
          <TabsContent value="style_transfer">
            <StyleTransferCard userId={session?.user?.id} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
