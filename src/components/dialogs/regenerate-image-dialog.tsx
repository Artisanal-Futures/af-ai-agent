import { CiImport } from "react-icons/ci";
import { FiThumbsDown } from "react-icons/fi";
import { FiThumbsUp } from "react-icons/fi";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";

import { Loader2 } from "lucide-react";

import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { DEMO_IMAGE_PATH } from "~/data/image";
import { env } from "~/env";
import { downloadImage } from "~/lib/download";
import { api } from "~/trpc/react";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";

type Props = {
  projectName: string;
  prompt: string;
  imageUrl: string;
  userId: string | null;
  demo?: boolean;
};

export function RegenerateImageDialog({
  projectName,
  prompt,
  imageUrl,
  userId,
  demo,
}: Props) {
  const [showDownloadCard, setShowDownloadCard] = useState(false);

  const [guidanceScale, setGuidanceScale] = useState<number>(8.3);
  const handleSliderChange = (value: number[]) => {
    if (value.length > 0) {
      setGuidanceScale(value[0] ?? 0);
    }
  };

  // Create a function that takes a  url and downloads it
  const [negativePrompt, setNegativePrompt] = useState<string>(
    "low resolution, blurry image...",
  );
  const [regeneratedImage, setRegeneratedImage] = useState<string>("");

  const regenerateImage = api.agent.regenerateImage.useMutation({
    onSuccess: (imageData) => {
      console.log("Image regenerated successfully");
      setRegeneratedImage(
        `${env.NEXT_PUBLIC_BACKEND_URL}${imageData.output_image_url}`,
      );
    },
    onError: (error) => {
      console.error("Error regenerating image:", error);
      setRegeneratedImage(DEMO_IMAGE_PATH);
    },
  });

  const recordLike = api.agent.recordLikes.useMutation({
    onSuccess: () => {
      console.log("Like recorded successfully");
    },
    onError: (error) => {
      console.error("Error recording like:", error);
    },
  });

  const handleRegenerateImage = async () => {
    regenerateImage.mutate({
      project_title: projectName,
      prompt: prompt,
      user_id: userId ?? "",
      demo,
      guidance_scale: guidanceScale,
      negative_prompt: negativePrompt,
    });
  };

  const handleThumbsDownClick = () => {
    console.log("Disliked image, regenerate");
    recordLike.mutate({
      generated_image_id: projectName, //replace with image id
      user_id: userId ?? "",
      like: 0,
    });
    setShowDownloadCard(true);
  };

  const handleThumbsUpClick = () => {
    console.log("Liked image");
    recordLike.mutate({
      generated_image_id: projectName, //replace with image id
      user_id: userId ?? "",
      like: 1,
    });
  };



  return (
    <Dialog open={showDownloadCard} onOpenChange={setShowDownloadCard}>
      {/* <Button className="#ffffff-text-thin flex space-x-2">
          <span>Regenerate Image</span>
        </Button> */}
      {/* <DialogTrigger asChild>
        <div className="flex space-x-2">
          <FiThumbsDown
            className="cursor-pointer text-gray-700"
            aria-label="Regenerate Image"
          />
          <FiThumbsUp
            className="cursor-pointer text-gray-700"
            aria-label="Like Image"
          />
        </div>
      </DialogTrigger> */}

      <div className="flex space-x-2">
        <FiThumbsUp
          className="h-9 w-9 cursor-pointer text-gray-700 transition-colors duration-200 hover:text-green-500 hover:bg-green-100 rounded-md p-2"
          aria-label="Like Image"
          onClick={handleThumbsUpClick}
        />
        <HoverCard>
          <HoverCardTrigger>
            <FiThumbsDown
              className="h-9 w-9 cursor-pointer text-gray-700 transition-colors duration-200 hover:text-red-500 hover:bg-red-100 rounded-md p-2"
              aria-label="Dislike Image"
              onClick={handleThumbsDownClick}
            />
          </HoverCardTrigger>
          <HoverCardContent side="top" align="center">
            <p className="text-center text-sm">
              Dislike the generated image? Click here to regenerate it based on your preferences.
            </p>
          </HoverCardContent>
        </HoverCard>
      </div>
      <DialogContent className="sm:max-w-6xl ">
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="col-span-1 space-y-2">
            <div className="mb-4 ml-6 space-y-1">
              <DialogTitle className="text-2xl">Regenerate Image</DialogTitle>
              <DialogDescription className="text-lg">
                Regenerate your image by providing a new negative prompt <br />
                and adjusting the guidance scale. This allows you to refine <br />
                the image output based on different constraints and preferences.
                <br />
              </DialogDescription>
              <Label className="text-base">
                Project Name :
                <span className="ml-2 text-base font-light italic text-gray-500">
                  {projectName}
                </span>
              </Label>
            </div>
            <div className="mb-4 ml-6 space-y-1">
              <Label className="text-base">
                Previous Prompt
                <span className="ml-2 text-base font-light italic text-gray-500">
                  {prompt}
                </span>
              </Label>
            </div>
            <div className="mb-4 ml-6 flex items-center space-x-1">
              <Label className="flex items-center text-base">
                Negative Prompt
              </Label>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button
                    className="text-black-700 flex h-6 w-6 items-center justify-center rounded-full border border-black bg-white p-0 text-xs font-semibold hover:bg-gray-200"
                    aria-label="Information"
                  >
                    <span className="italic">i</span>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent side="right" align="center">
                  <p className="text-center text-sm">
                    This parameter specifies what you don&apos;t want to see in
                    the generated images. Use this to guide and correct parts of
                    your previously generated image. <br /> Ex: remove blur,
                    shade, etc...
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div className="mb-4 ml-6 flex items-center space-x-1">
              <Input
                id="username"
                className="text-base font-light italic text-gray-500"
                defaultValue="Design a bag with this pattern"
                onChange={(e) => setNegativePrompt(e.target.value)}
              />
            </div>
            <div className="mb-4 ml-6 flex items-center space-x-1">
              <Label className="flex items-center text-base">
                Guidance Scale:{" "}
                <span className="ml-1 font-medium">{guidanceScale}</span>
              </Label>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button
                    className="text-black-700 ml-2 flex h-6 w-6 items-center justify-center rounded-full border border-black bg-white p-0 text-xs font-semibold hover:bg-gray-200"
                    aria-label="Information"
                  >
                    <span className="italic">i</span>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent side="right" align="center">
                  <p className="text-center text-sm">
                    This parameter affects how much the prompt influences image
                    generation. A lower value gives the model
                    &quot;creativity&quot; to generate images that are more
                    loosely related to the prompt.
                    <br /> A higher guidance scale value pushes the model to
                    follow the prompt more closely. <br /> 8.3 is the
                    recommended value.
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div className="mb-6 ml-6 flex items-center space-x-1 mb-6">
              <Slider
                defaultValue={[guidanceScale]}
                max={10}
                step={0.1}
                onValueChange={handleSliderChange}
                className="mt-2"
              />

            </div>
            <Button
              className="mb-4 ml-6 flex items-center space-x-1 mt-6"
              onClick={handleRegenerateImage}
              disabled={regenerateImage.isPending}
            >
              {regenerateImage.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {regenerateImage.isPending ? "Regenerating..." : "Regenerate Image"}
            </Button>

          </div>
          {/* Right Column */}
          <div className="col-span-1 flex flex-col items-center space-y-2">
            {/* previous image */}
            <Label className="text-base">Previous Image</Label>
            <div className="relative mt-7 flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100">
              {imageUrl ? (
                <Image src={imageUrl} alt="Generated Image" fill={true} />
              ) : (
                <span className="text-lg font-bold text-gray-400">
                  Generated Image
                </span>
              )}
            </div>
            {/* new image */}
            <Label className="text-base">Regenerated Image</Label>
            <div className=" relative mt-7 flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100">
              {regenerateImage.isPending ? (
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <span className="mt-2 text-lg font-bold text-gray-400">
                    Loading Image...
                  </span>
                </div>
              ) : regeneratedImage ? (
                <Image
                  fill={true}
                  src={regeneratedImage}
                  alt="Regenerated Image"
                />
              ) : (
                <span className="text-lg font-bold text-gray-400">
                  Regenerated Image
                </span>
              )}
            </div>
            <div className="mt-5 flex w-full justify-center">
              {regeneratedImage && (
                <Button
                  className="#ffffff-text-thin mr-4 flex space-x-2"
                  onClick={() => void downloadImage(regeneratedImage)}
                  disabled={regenerateImage.isPending || !regenerateImage}
                >
                  <span>Download</span>
                  <CiImport className="text-xl" />
                </Button>
              )}
            </div>
          </div>
        </div>
        {/* <DialogFooter>
          <Button
            className="mr-auto mt-4 text-base "
            onClick={handleRegenerateImage}
            disabled={regenerateImage.isPending}
          >
            {regenerateImage.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {regenerateImage.isPending ? "Regenerating..." : "Regenerate Image"}
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
