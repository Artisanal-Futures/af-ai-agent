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

export const ImageGenerateCard = (props: Props) => {
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [projectName, setProjectName] = useState("Jacket Design Ideas");
  const [prompt, setPrompt] = useState(
    "An image of a denim jacket with floral embroidery",
  );

  const generateImage = api.agent.generateImage.useMutation({
    onSuccess: (imageData) => {
      console.log("Image generated successfully");
      setGeneratedImage(imageData);
    },
    onError: (error) => {
      console.error("Error generating image:", error);
      setGeneratedImage("test");
    },
  });

  const handleGenerateImage = async () => {
    try {
      const imageData = await generateImage.mutateAsync({
        project_title: projectName,
        prompt: prompt,
        user_id: props?.userId ?? "",
      });
      setGeneratedImage(imageData);
    } catch (error) {
      console.error("Failed to generate image:", error);
      setGeneratedImage(defaultImagePath);
    }

    //placeholder
    // setGeneratedImage(defaultImagePath);
  };

  return (
    <Card>
      <CardContent className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="col-span-1 space-y-2">
          <CardHeader>
            <CardTitle className="text-2xl">Generate Image</CardTitle>
            <CardDescription className="text-lg">
              Enter your project name and image prompt to generate AI images.
            </CardDescription>
          </CardHeader>
          <div className="ml-6 space-y-1">
            <Label htmlFor="name" className="text-base">
              Project Name
            </Label>
            <Input
              id="name"
              className="text-base font-light italic text-gray-500"
              defaultValue="Jacket Design Ideas"
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="mb-2 ml-6 space-y-1">
            <Label htmlFor="username" className="text-base">
              Prompt
            </Label>
            <Input
              id="username"
              className="text-base font-light italic text-gray-500"
              defaultValue="An image of a denim jacket with floral embroidery"
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <CardFooter className="">
            {/* <Button className="text-base mt-4">Generate Image</Button> */}
            {/* Generate Image */}
            <Button
              className="mt-4 text-base"
              onClick={handleGenerateImage}
              disabled={generateImage.isPending}
            >
              {generateImage.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {generateImage.isPending ? "Generating..." : "Generate Image"}
            </Button>
          </CardFooter>
        </div>
        {/* Right Column */}
        <div className="col-span-1 flex flex-col items-center justify-center space-y-5">
          <div className="mt-7 flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100">
            {/* <span className="text-lg font-bold text-gray-300">Generated Image</span> */}
            {generateImage.isPending ? (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="mt-2 text-lg font-bold text-gray-400">
                  Loading Image...
                </span>
              </div>
            ) : generatedImage ? (
              <img
                src={generatedImage}
                alt="Generated Image"
                // style={{ maxWidth: '100%', maxHeight: '500px' }}
              />
            ) : (
              <span className="text-lg font-bold text-gray-400">
                Generated Image
              </span>
            )}
          </div>
          <div className="mt-5 flex w-full justify-center">
            <DownloadSurveyDialog imageUrl={generatedImage} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};