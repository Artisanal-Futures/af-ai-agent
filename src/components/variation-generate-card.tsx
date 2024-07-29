import { Loader2 } from "lucide-react";

import { useState } from "react";
import { CiImport } from "react-icons/ci";
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

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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
      setGeneratedVariation(varData);
    },
    onError: (error) => {
      console.error("Error creating image variation:", error);
      setGeneratedVariation("test");
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
    try {
      const varData = await createImageVariation.mutateAsync({
        guidance_prompt: guidancePrompt,
        project_title: projectName2,
        user_id: props?.userId ?? "",
        input_image: image, // Assuming you have the base64 string of the input image
      });
      setGeneratedVariation(varData);
    } catch (error) {
      console.error("Failed to create image variation:", error);
      setGeneratedVariation(defaultImagePath);
    }
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
              className="text-base font-light italic text-gray-500 hover:underline"
              onChange={handleImageUpload}
            />
            {selectedImage && (
              <div className="mt-2">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="h-64 w-64 object-cover"
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
          <div className="mt-7 flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100">
            {createImageVariation.isPending ? (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="mt-2 text-lg font-bold text-gray-400">
                  Loading Image...
                </span>
              </div>
            ) : generatedVariation ? (
              <img
                src={generatedVariation}
                alt="Generated Variation"
                // style={{ maxWidth: '100%', maxHeight: '500px' }}
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
