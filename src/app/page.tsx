"use client";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { CiImport } from "react-icons/ci";
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
import { api } from "~/trpc/react";
import { SessionDropDownMenu } from "./(auth)/_components/session-dropdown-menu";
import { SignInButton } from "./(auth)/_components/sign-in-button";

export default function Home() {
  const generateImage = api.agent.generateImage.useMutation({
    onSuccess: (imageData) => {
      console.log("Image generated successfully");
      setGeneratedImage(imageData);
    },
    onError: (error) => {
      console.error("Error generating image:", error);
    },
  });

  //image generate
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const handleGenerateImage = async () => {
    await generateImage.mutateAsync({
      project_name: projectName,
      prompt: prompt,
      user_uname: session?.user?.name ?? "user",
    });
  };

  //File Upload
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  //Survey
  const [showDownloadCard, setShowDownloadCard] = useState(false);
  const [showSurveyDownload, setShowSurveyDownload] = useState(false);

  const handleDownloadClick = () => {
    setShowDownloadCard(true);
    setShowSurveyDownload(false);
  };
  const handleCloseCard = () => {
    setShowDownloadCard(false);
  };
  // const handleSurveyDownloadClick = () => {
  //   setShowSurveyDownload(true);
  // };

  const onSubmit = (data: unknown) => {
    console.log(data);
    setShowDownloadCard(true);
  };

  const [showLink, setShowLink] = useState(false);

  const handleNoClick = () => {
    setShowLink(true);
  };

  // survey submit
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

  //AI form vals
  const [projectName, setProjectName] = useState("Jacket Design Ideas");
  const [prompt, setPrompt] = useState(
    "An image of a denim jacket with floral embroidery",
  );
  const handleAIFormClick = () => {
    // Collecting survey responses
    const aiFormResponses = {
      projectName,
      prompt,
    };

    // Logging the survey responses to the console
    console.log(aiFormResponses);
    // setaiFormResponses(true);

    // Close the survey card if needed
    //setShowDownloadCard(false);
  };

  //

  const { data: session } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ffffff] to-[#e5e7eb] text-black">
      {/* Menu */}
      <div className="fixed left-0 right-0 top-0 z-50 flex w-full items-center justify-between bg-white px-4 py-2 shadow-md">
        <div className="flex items-center space-x-4">
          {/* Profile Pic and info */}
          <SignInButton hasSession={!!session} />
          <SessionDropDownMenu hasSession={!!session} sessionData={session} />
          {/* Replace with user name*/}

          <span className="text-lg font-semibold">
            Hi, {session?.user?.name ?? "user!"}{" "}
            {!session && " Login to save your work"}
          </span>
        </div>
        <div className="flex space-x-4">
          <Button className="text-sm-black rounded-lg bg-gray-200 px-3 py-1 hover:bg-gray-300">
            Prompt History
          </Button>
          <Button className="text-sm-black rounded-lg bg-gray-200 px-3 py-1 hover:bg-gray-300">
            Image Variations
          </Button>
          <Button className="text-sm-black rounded-lg bg-gray-200 px-3 py-1 hover:bg-gray-300">
            Image Descriptions
          </Button>
        </div>
      </div>
      <h1 className="mt-4 text-5xl font-bold">Stable Diffusion AI Agent</h1>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-12">
        <Tabs defaultValue="generate" className="h-[auto] w-[90%]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Image</TabsTrigger>
            <TabsTrigger value="variation">Create Variations</TabsTrigger>
          </TabsList>
          {/*Generate Image Tab */}
          <TabsContent value="generate">
            <Card>
              <CardContent className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="col-span-1 space-y-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">Generate Image</CardTitle>
                    <CardDescription className="text-lg">
                      Enter your project name and image prompt to generate AI
                      images.
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
                      {generateImage.isPending
                        ? "Generating..."
                        : "Generate Image"}
                    </Button>

                    {generatedImage && (
                      <div>
                        <h2>Generated Image</h2>
                        <img
                          src={`data:image/jpeg;base64,${generatedImage}`}
                          alt="Generated Image"
                        />
                      </div>
                    )}
                  </CardFooter>
                </div>
                {/* Right Column */}
                <div className="col-span-1 flex flex-col items-center justify-center space-y-5">
                  <div className="mt-7 flex h-64 w-64 items-center justify-center bg-gray-200">
                    <span className="text-lg font-bold">Generated Image</span>
                  </div>
                  {/* <p className="text-lg text-center mt-2">Placeholder for generated image</p> */}
                  {/* <div className="flex justify-end w-full mt-5 mr-6"> */}
                  <div className="mt-5 flex w-full justify-center">
                    <Button
                      className="#ffffff-text-thin flex space-x-2"
                      onClick={handleDownloadClick}
                    >
                      <span>Download</span>
                      <CiImport className="text-xl" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Create Variation Tab*/}
          <TabsContent value="variation">
            <Card>
              <CardContent className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="col-span-1 space-y-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      Create Image Variations
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Enter your project name and upload an image and prompt
                      that you would like to see variations of.
                    </CardDescription>
                  </CardHeader>
                  <div className="ml-6 space-y-1">
                    <Label htmlFor="name" className="text-base">
                      Project Name
                    </Label>
                    <Input
                      id="name"
                      className="text-base font-light italic text-gray-500"
                      defaultValue="Bag Design Ideas"
                    />
                  </div>
                  <div className="ml-6 space-y-1">
                    <Label htmlFor="username" className="text-base">
                      Guiding Prompt
                    </Label>
                    <Input
                      id="username"
                      className="text-base font-light italic text-gray-500"
                      defaultValue="Design a bag with this pattern"
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
                    <Button className="mt-3 text-base">Create Variation</Button>
                  </CardFooter>
                </div>
                {/* Right Column */}
                <div className="col-span-1 flex flex-col items-center justify-center space-y-3">
                  <div className="mb-9 mt-10 flex h-64 w-64 items-center justify-center bg-gray-200">
                    <span className="text-lg font-bold">Generated Image</span>
                  </div>
                  <div className="flex w-full justify-center">
                    <Button
                      className="#ffffff-text-thin flex space-x-2"
                      onClick={handleDownloadClick}
                    >
                      <span>Download</span>
                      <CiImport className="text-xl" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Download/Survey Card */}
        {showDownloadCard && (
          <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <Card className="w-[60%] bg-white p-4">
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
                      Do you find the generated image satisfactory to your
                      needs?{" "}
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
                        <RadioGroupItem
                          value="option-three"
                          id="option-three"
                        />
                        <Label htmlFor="option-three">
                          Close but not quite
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="ml-6 space-y-1">
                    <Label htmlFor="username" className="text-base">
                      Can the generated image be used directly for digital
                      fabrication
                    </Label>
                    <RadioGroup defaultValue="option-one">
                      <div className="mb-4 flex items-center space-x-2">
                        <RadioGroupItem value="option-one" id="option-one" />
                        <Label htmlFor="option-one">Yes</Label>
                        <RadioGroupItem value="No" id="option-two" />
                        <Label htmlFor="option-two">No</Label>
                        <RadioGroupItem
                          value="option-three"
                          id="option-three"
                        />
                        <Label htmlFor="option-three">
                          Will need another tool
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <CardFooter className="">
                    <Button
                      className="mt-5 text-base"
                      onClick={handleSurveyDownloadClick}
                    >
                      Send Survey
                    </Button>
                  </CardFooter>
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
                  <div className="mt-3 flex h-64 w-64 items-center justify-center bg-gray-200">
                    <span className="text-lg font-bold">Generated Image</span>
                  </div>
                  {showSurveyDownload && (
                    <div
                      className="mt-5 flex w-full justify-center"
                      id="surveyDownload"
                    >
                      <Button
                        className="#ffffff-text-thin flex space-x-2"
                        onClick={handleCloseCard}
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
        )}
      </div>
    </main>
  );
}
