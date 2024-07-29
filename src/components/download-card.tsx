import { create } from "domain";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { CiImport } from "react-icons/ci";
import { ImageGenerateCard } from "~/components/image-generate-card";
import { StyleTransferCard } from "~/components/style-transfer-card";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { VariationGenerateCard } from "~/components/variation-generate-card";
import { api } from "~/trpc/react";

type Props = {
  handleCloseCard: () => void;
  handleNoClick: () => void;
  handleSurveyDownloadClick: () => void;
  showLink: boolean;
  showSurveyDownload: boolean;
};

export const DownloadCard = (props: Props) => {
  //       //AI form vals
  //   const [projectName, setProjectName] = useState("Jacket Design Ideas");
  //   const [prompt, setPrompt] = useState(
  //     "An image of a denim jacket with floral embroidery",
  //   );
  //   const handleAIFormClick = () => {
  //     // Collecting survey responses
  //     const aiFormResponses = {
  //       projectName,
  //       prompt,
  //     };
  //     // Logging the survey responses to the console
  //     console.log(aiFormResponses);

  //     // Close the survey card if needed
  //     //setShowDownloadCard(false);
  //   };

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <Card className="w-[60%] bg-white p-4">
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={props.handleCloseCard}
            className="text-gray-500 hover:text-gray-700"
          >
            &#x2715;
          </button>
        </div>
        <CardContent className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="col-span-1 flex-col space-y-2">
            <CardHeader>
              <CardTitle className="text-2xl">Image Survey</CardTitle>
              <CardDescription className="text-lg">
                Complete this survey to download your image.
              </CardDescription>
            </CardHeader>
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
                    onClick={props.handleNoClick}
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
            <CardFooter className="">
              <Button
                className="mt-5 text-base"
                onClick={props.handleSurveyDownloadClick}
              >
                Send Survey
              </Button>
            </CardFooter>
          </div>
          {/* Right Column */}
          <div className="col-span-1 flex flex-col items-center justify-center space-y-3">
            {props.showLink && (
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
            <div className="mt-3 flex h-64 w-64 items-center justify-center bg-gray-200">
              <span className="text-lg font-bold">Generated Image</span>
            </div>
            {props.showSurveyDownload && (
              <div
                className="mt-5 flex w-full justify-center"
                id="surveyDownload"
              >
                <Button
                  className="#ffffff-text-thin flex space-x-2"
                  onClick={props.handleCloseCard}
                >
                  <span>Download</span>
                  <CiImport className="text-xl" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
