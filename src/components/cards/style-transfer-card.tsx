import { Loader2 } from "lucide-react";
import { useEffect } from "react";

import { useState } from "react";

import { Button } from "~/components/ui/button";

import { api } from "~/trpc/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import Image from "next/image";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { DEMO_IMAGE_PATH } from "~/data/image";
import { env } from "~/env";
import { convertBlobToBase64 } from "~/lib/convert";

import { handleImageUpload } from "~/lib/file";
import { DownloadButton } from "../download-button";
import { ImagePreview } from "../image-preview";

type Props = {
  userId?: string | null | undefined;
  demo?: boolean;
};

export const StyleTransferCard = (props: Props) => {
  const [projectName, setProjectName] = useState<string>("Bag Design Ideas");

  const [selectedContentImage, setSelectedContentImage] = useState<
    string | null
  >(null);
  const [selectedStyleImage, setSelectedStyleImage] = useState<string | null>(
    null,
  );

  const [createdImage, setCreatedImage] = useState<string | null>(null);

  const transferStyle = api.agent.neuralStyleTransfer.useMutation({
    onSuccess: (varData) => {
      console.log("Image variation created successfully");
      setCreatedImage(`${env.NEXT_PUBLIC_NST_URL}${varData.output_image_url}`);
    },
    onError: (error) => {
      console.error("Error creating image variation:", error);
      setCreatedImage(DEMO_IMAGE_PATH);
    },
  });

  const handleCreateStyleTransfer = async () => {
    const base64StyleImage = await convertBlobToBase64(
      selectedStyleImage ?? "",
    );
    const base64ContentImage = await convertBlobToBase64(
      selectedContentImage ?? "",
    );

    transferStyle.mutate({
      content_image: base64ContentImage!,
      style_image: base64StyleImage!,
      project_title: projectName ?? "New Project",
      user_id: props?.userId ?? "",
      demo: props?.demo,
    });
  };

  //disable clicking while function running
  useEffect(() => {
    const tabsElement = document.getElementById("tabs-list");
    const tabs = document.getElementById("tabs");
    if (tabsElement && tabs) {
      if (transferStyle.isPending) {
        tabsElement.style.pointerEvents = "none";
        tabs.style.cursor = "not-allowed";
      }
      else {
        tabsElement.style.pointerEvents = "auto";
        tabs.style.cursor = "default";
      }
    }
  }, [transferStyle.isPending]);

  return (
    <Card>
      <CardContent className="grid grid-cols-4 gap-4">
        {/* Left Column */}
        <div className="col-span-2 space-y-2">
          <CardHeader>
            <CardTitle className="text-2xl">Neural Style Transfer</CardTitle>
            <CardDescription className="text-lg">
              Enter two images. One of your content and another of a style you
              would like to apply to your content.
            </CardDescription>
          </CardHeader>
          <div className="ml-6 space-y-1">
            <Label htmlFor="name" className="text-base">
              Project Name
            </Label>
            <Input
              id="name"
              className="text-base font-light italic text-gray-500"
              defaultValue="Project 1"
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="ml-6 flex flex-col space-y-1">
            <div className="mr-6">
              <Label htmlFor="content-upload" className="text-base">
                Upload Content Image
              </Label>
              <Input
                id="content-upload"
                type="file"
                className="text-base font-light italic text-gray-500 hover:underline"
                onChange={(e) =>
                  handleImageUpload({
                    e,
                    setSelectedImage: setSelectedContentImage,
                  })
                }
              />
              {selectedContentImage && (
                <div className="relative mt-2 h-64  w-64">
                  <Image
                    fill={true}
                    src={selectedContentImage}
                    alt="Selected Content"
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="style-upload" className="text-base">
                Upload Style Image
              </Label>
              <Input
                id="style-upload"
                type="file"
                className="text-base font-light italic text-gray-500 hover:underline"
                onChange={(e) =>
                  handleImageUpload({
                    e,
                    setSelectedImage: setSelectedStyleImage,
                  })
                }
              />
              {selectedStyleImage && (
                <div className="relative mt-2 h-64  w-64">
                  <Image
                    fill={true}
                    src={selectedStyleImage}
                    alt="Selected Style"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <CardFooter className="">
            {/* Generate Image */}
            <Button
              className="mt-4 text-base"
              onClick={handleCreateStyleTransfer}
              disabled={transferStyle.isPending}
            >
              {transferStyle.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {transferStyle.isPending ? "Transferring..." : "Transfer Style"}
            </Button>
          </CardFooter>
        </div>
        {/* Right Column */}
        <div className="col-span-2 flex flex-col items-center justify-center space-y-5">
          <ImagePreview
            isPending={transferStyle.isPending}
            imageUrl={createdImage}
            title="Generated Style Transfer"
          />

          {/* <div className="flex justify-end w-full mt-5 mr-6"> */}

          {createdImage && (
            <div className="mt-5 flex w-full justify-center">
              <DownloadButton imageUrl={createdImage} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
