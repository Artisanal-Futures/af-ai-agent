import { useEffect } from "react";
import { useState } from "react";

import { Loader2 } from "lucide-react";

import { Button } from "~/components/ui/button";
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

import { api } from "~/trpc/react";

import { DEMO_IMAGE_PATH } from "~/data/image";

import { env } from "~/env";
import { RegenerateImageDialog } from "../dialogs/regenerate-image-dialog";

import { DownloadButton } from "../download-button";
import { ImagePreview } from "../image-preview";

type Props = {
  userId?: string | null | undefined;
  demo?: boolean;
  initialPrompt?: string;
};

export const ImageGenerateCard = (props: Props) => {
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [projectName, setProjectName] = useState("Jacket Design Ideas");
  const [prompt, setPrompt] = useState<string>(props.initialPrompt ?? "An image of a denim jacket with floral embroidery");

  const generateImage = api.agent.generateImage.useMutation({
    onSuccess: (imageData) => {
      console.log("Image generated successfully");
      setGeneratedImage(`${env.NEXT_PUBLIC_BACKEND_URL}${imageData.image_url}`);
    },
    onError: (error) => {
      console.error("Error generating image:", error);
      setGeneratedImage(DEMO_IMAGE_PATH);
    },
  });

  const handleGenerateImage = () => {
    generateImage.mutate({
      project_title: projectName,
      prompt: prompt,
      user_id: props?.userId ?? "",
      demo: props?.demo,
    });
  };

  //disable clicking while function running
  useEffect(() => {
    const tabsElement = document.getElementById("tabs-list");
    const tabs = document.getElementById("tabs");
    if (tabsElement && tabs) {
      if (generateImage.isPending) {
        tabsElement.style.pointerEvents = "none";
        tabs.style.cursor = "not-allowed";
      }
      else {
        tabsElement.style.pointerEvents = "auto";
        tabs.style.cursor = "default";
      }
    }
  }, [generateImage.isPending]);




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
              disabled={generateImage.isPending}
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
              disabled={generateImage.isPending}
            />
          </div>
          <CardFooter className="">
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
          <ImagePreview
            isPending={generateImage.isPending}
            imageUrl={generatedImage}
            title="Generated Image"
          />

          {generatedImage && (
            <div className="mt-5 flex w-full justify-center gap-4">
              <DownloadButton imageUrl={generatedImage} />

              <RegenerateImageDialog
                userId={props.userId ?? null}
                imageUrl={generatedImage}
                projectName={projectName}
                prompt={prompt}
                demo={props?.demo}
              />
              {/* <LikesDialog
                userId={props.userId ?? null}
                imageUrl={generatedImage}
                projectName={projectName}
                prompt={prompt}
                demo={props?.demo}
              /> */}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
