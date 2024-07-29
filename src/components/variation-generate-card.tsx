import { Loader2 } from "lucide-react";

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
import { BASE_URL, DEMO_IMAGE_PATH } from "~/data/image";
import { DownloadSurveyDialog } from "./dialogs/download-survey-dialog";

const defaultImagePath =
  "/img/stable-diffusion-xl--f7d3df13d07a4c4abe50690e4a994336.png";

type Props = {
  userId?: string | null | undefined;
};

export const VariationGenerateCard = (props: Props) => {
  const [generatedVariation, setGeneratedVariation] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [projectName2, setProjectName2] = useState<string>("Bag Design Ideas");
  const [guidancePrompt, setGuidancePrompt] = useState<string>(
    "Design a bag with this pattern",
  );

  const createImageVariation = api.agent.createImageVariation.useMutation({
    onSuccess: (varData) => {
      console.log("Image variation created successfully");
      setGeneratedVariation(`${BASE_URL}${varData.output_image_url}`);
    },
    onError: (error) => {
      console.error("Error creating image variation:", error);
      setGeneratedVariation(DEMO_IMAGE_PATH);
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };
  const image = selectedImage ?? defaultImagePath;

  const handleCreateImageVariation = async () => {
    const base64Image = await convertBlobToBase64(image);

    createImageVariation.mutate({
      guidance_prompt: guidancePrompt,
      project_title: projectName2,
      user_id: props?.userId ?? "",
      image: base64Image ?? "", // Assuming you have the base64 string of the input image
    });
  };

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
              onChange={(e) => setProjectName2(e.target.value)}
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
              onChange={handleImageUpload}
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
          <div className="relative mt-7 flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100">
            {createImageVariation.isPending ? (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="mt-2 text-lg font-bold text-gray-400">
                  Loading Image...
                </span>
              </div>
            ) : generatedVariation ? (
              <Image
                fill={true}
                src={generatedVariation}
                alt="Generated Variation"
              />
            ) : (
              <span className="text-lg font-bold text-gray-400">
                Generated Variation
              </span>
            )}
          </div>
          <div className="flex w-full justify-center">
            <DownloadSurveyDialog imageUrl={generatedVariation} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ensureBase64Padding = (base64String: string) => {
  // Add padding if necessary
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  return base64String + padding;
};

const convertBlobToBase64 = async (url: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const base64String = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return ensureBase64Padding((base64String as string).split(",")[1]!);
  } catch (error) {
    console.error("Error converting Blob to Base64:", error);
    return null;
  }
};
