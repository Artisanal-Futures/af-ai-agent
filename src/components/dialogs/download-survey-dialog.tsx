import { CiImport } from "react-icons/ci";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";

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

export function DownloadSurveyDialog({ imageUrl }: { imageUrl: string }) {
  const [showDownloadCard, setShowDownloadCard] = useState(false);
  const [showLink, setShowLink] = useState(false);

  const handleNoClick = () => {
    setShowLink(true);
  };

  const [showSurveyDownload, setShowSurveyDownload] = useState(false);

  const [imageSatisfactory, setImageSatisfactory] = useState("option-one");
  const [imageUsability, setImageUsability] = useState("option-one");

  const handleSurveyDownloadClick = () => {
    // Collecting survey responses
    const surveyResponses = {
      imageSatisfactory,
      imageUsability,
    };

    // Logging the survey responses to the console
    console.log(surveyResponses);
    setShowSurveyDownload(true);

    // Close the survey card if needed
    //setShowDownloadCard(false);
  };

  // Create a function that takes a  url and downloads it
  const downloadImage = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "image.png"; // Set the default name for the downloaded image
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowDownloadCard(false);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  return (
    <Dialog open={showDownloadCard} onOpenChange={setShowDownloadCard}>
      <DialogTrigger asChild>
        <Button className="#ffffff-text-thin flex space-x-2">
          <span>Download</span>
          <CiImport className="text-xl" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[60%]">
        <DialogHeader>
          <DialogTitle>Image Survey</DialogTitle>
          <DialogDescription className="text-lg">
            Complete this survey to download your image.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="col-span-1 flex-col space-y-2 ">
            <div className="ml-6 space-y-1">
              <Label htmlFor="name" className="text-base">
                Do you find the generated image satisfactory to your needs?{" "}
              </Label>
              <RadioGroup defaultValue="option-one">
                <div className="mb-7 flex items-center space-x-2">
                  <RadioGroupItem value="option-one" id="option-one" />
                  <Label htmlFor="option-one">Yes</Label>
                  <RadioGroupItem
                    value="option-two"
                    id="option-two"
                    onClick={handleNoClick}
                  />
                  <Label htmlFor="option-two">No</Label>
                  <RadioGroupItem value="option-three" id="option-three" />
                  <Label htmlFor="option-three">Close but not quite</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="ml-6 space-y-1">
              <Label htmlFor="username" className="text-base">
                Can the generated image be used directly for digital fabrication
              </Label>
              <RadioGroup defaultValue="option-one">
                <div className="mb-4 flex items-center space-x-2">
                  <RadioGroupItem value="option-one" id="option-one" />
                  <Label htmlFor="option-one">Yes</Label>
                  <RadioGroupItem value="No" id="option-two" />
                  <Label htmlFor="option-two">No</Label>
                  <RadioGroupItem value="option-three" id="option-three" />
                  <Label htmlFor="option-three">Will need another tool</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          {/* Right Column */}
          <div className="col-span-1 flex flex-col items-center justify-center space-y-3">
            {showLink && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <a
                    href="your-new-page-url"
                    className="underline-on-hover text-blue-500"
                  >
                    Advanced Image Variation Settings
                  </a>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                      <p className="text-sm">
                        Not happy with the image generated? <br />
                        Try again using our advanced variation settings.
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
            <div className="relative mt-3 flex h-64 w-64 items-center justify-center bg-gray-200">
              {/* <span className="text-lg font-bold">Generated Image</span> */}
              {imageUrl ? (
                <Image fill={true} src={imageUrl} alt="Generated Image" />
              ) : (
                <span className="text-lg font-bold text-gray-400">
                  Generated Image
                </span>
              )}{" "}
            </div>

            {showSurveyDownload && (
              <div
                className="mt-5 flex w-full justify-center"
                id="surveyDownload"
              >
                <Button
                  className="#ffffff-text-thin flex space-x-2"
                  onClick={() => void downloadImage(imageUrl)}
                >
                  <span>Download</span>
                  <CiImport className="text-xl" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            className="mr-auto mt-5 text-base "
            onClick={handleSurveyDownloadClick}
          >
            Send Survey
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
