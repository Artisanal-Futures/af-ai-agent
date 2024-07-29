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

export const StyleTransferCard = (props: Props) => {
  const [selectedContentImage, setSelectedContentImage] = useState<
    string | null
  >(null);
  const [selectedStyleImage, setSelectedStyleImage] = useState<string | null>(
    null,
  );

  const handleContentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedContentImage(URL.createObjectURL(file));
    }
  };

  const handleStyleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedStyleImage(URL.createObjectURL(file));
    }
  };

  return (
    <Card>
      <CardContent className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="col-span-1 space-y-2">
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
            />
          </div>
          <div className="ml-6 flex flex-row space-y-1">
            <div className="mr-6">
              <Label htmlFor="content-upload" className="text-base">
                Upload Content Image
              </Label>
              <Input
                id="content-upload"
                type="file"
                className="text-base font-light italic text-gray-500 hover:underline"
                onChange={handleContentImageUpload}
              />
              {selectedContentImage && (
                <div className="mt-2">
                  <img
                    src={selectedContentImage}
                    alt="Selected Content"
                    className="h-64 w-64 object-cover"
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
                onChange={handleStyleImageUpload}
              />
              {selectedStyleImage && (
                <div className="mt-2">
                  <img
                    src={selectedStyleImage}
                    alt="Selected Style"
                    className="h-64 w-64 object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <CardFooter className="">
            <Button className="mt-4 text-base">Transfer Style</Button>
            {/* Generate Image */}
            {/* <Button
            className="mt-4 text-base"
            onClick={handleGenerateImage}
            disabled={generateImage.isPending}
          >
            {generateImage.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {generateImage.isPending
              ? "Transfering..."
              : "Transfer Style"}
          </Button> */}
          </CardFooter>
        </div>
        {/* Right Column */}
        <div className="col-span-1 flex flex-col items-center justify-center space-y-5">
          <div className="mt-7 flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100">
            {/* <span className="text-lg font-bold text-gray-300">Generated Image</span> */}
            {/* {generateImage.isPending ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="mt-2 text-lg font-bold text-gray-400">
                Loading Image...
              </span>
            </div>
          ) : generatedImage ? (
            <img
              className="h-full w-full object-cover rounded-lg"
              src={`data:image/jpeg;base64,${generatedImage}`}
              alt="Generated Image"
            />
          ) : (
            <span className="text-lg font-bold text-gray-400">
              Generated Image
            </span>
          )} */}
          </div>
          {/* <div className="flex justify-end w-full mt-5 mr-6"> */}
          <div className="mt-5 flex w-full justify-center">
            <DownloadSurveyDialog imageUrl={defaultImagePath} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
