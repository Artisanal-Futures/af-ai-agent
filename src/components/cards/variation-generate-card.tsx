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

export const VariationGenerateCard = (props: Props) => {
  const [generatedVariation, setGeneratedVariation] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>("Bag Design Ideas");
  const [guidancePrompt, setGuidancePrompt] = useState<string>(
    "Design a bag with this pattern",
  );

  const createImageVariation = api.agent.createImageVariation.useMutation({
    onSuccess: (varData) => {
      console.log("Image variation created successfully");
      setGeneratedVariation(
        `${env.NEXT_PUBLIC_BACKEND_URL}${varData.output_image_url}`,
      );
    },
    onError: (error) => {
      console.error("Error creating image variation:", error);
      setGeneratedVariation(DEMO_IMAGE_PATH);
    },
  });

  const image = selectedImage ?? DEMO_IMAGE_PATH;

  const handleCreateImageVariation = async () => {
    const base64Image = await convertBlobToBase64(image);

    createImageVariation.mutate({
      guidance_prompt: guidancePrompt,
      project_title: projectName,
      user_id: props?.userId ?? "",
      image: base64Image ?? "", // Assuming you have the base64 string of the input image
      demo: props?.demo,
    });
  };

  //disable clicking while function running
  useEffect(() => {
    const tabsElement = document.getElementById("tabs-list");
    const tabs = document.getElementById("tabs");
    if (tabsElement && tabs) {
      if (createImageVariation.isPending) {
        tabsElement.style.pointerEvents = "none";
        tabs.style.cursor = "not-allowed";
      }
      else {
        tabsElement.style.pointerEvents = "auto";
        tabs.style.cursor = "default";
      }
    }
  }, [createImageVariation.isPending]);

  return (
    <Card>
      <CardContent className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="col-span-1 space-y-2">
          <CardHeader>
            <CardTitle className="text-2xl">Create Image Variations</CardTitle>
            <CardDescription className="text-lg">
              Enter your project name and upload an image and prompt that you
              would like to see variations of.
            </CardDescription>
          </CardHeader>
          <div className="ml-6 space-y-1">
            <Label htmlFor="project_name" className="text-base">
              Project Name
            </Label>
            <Input
              id="name"
              className="text-base font-light italic text-gray-500"
              defaultValue="Bag Design Ideas"
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="ml-6 space-y-1">
            <Label htmlFor="guiding_prompt" className="text-base">
              Guiding Prompt
            </Label>
            <Input
              id="username"
              className="text-base font-light italic text-gray-500"
              defaultValue="Design a bag with this pattern"
              onChange={(e) => setGuidancePrompt(e.target.value)}
            />
          </div>
          <div className="ml-6 space-y-1">
            <Label htmlFor="file-upload" className="text-base">
              Upload Image
            </Label>
            <Input
              id="file-upload"
              type="file"
              accept="image/*"
              className="text-base font-light italic text-gray-500 hover:underline"
              onChange={(e) => handleImageUpload({ e, setSelectedImage })}
            />
            {selectedImage && (
              <div className="relative mt-2 h-64 w-64">
                <Image
                  fill={true}
                  src={selectedImage}
                  alt="Selected"
                  className="object-cover"
                />
              </div>
            )}
          </div>
          <CardFooter className="">
            <Button
              className="mt-4 text-base"
              onClick={handleCreateImageVariation}
              disabled={createImageVariation.isPending}
            >
              {createImageVariation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {createImageVariation.isPending
                ? "Creating..."
                : "Create Variation"}
            </Button>
          </CardFooter>
        </div>
        {/* Right Column */}
        <div className="col-span-1 flex flex-col items-center justify-center space-y-5">
          <ImagePreview
            isPending={createImageVariation.isPending}
            imageUrl={generatedVariation}
            title="Generated Variation"
          />

          {generatedVariation && (
            <div className="flex w-full justify-center">
              {/* <DownloadSurveyDialog imageUrl={generatedVariation} /> */}
              <DownloadButton imageUrl={generatedVariation} />
              
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
