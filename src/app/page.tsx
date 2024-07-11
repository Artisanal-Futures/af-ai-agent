"use client";
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
import { generateImage } from './api/api';

export default function Home() {

  //image generate
  const [generatedImage, setGeneratedImage] = useState<string>(''); // State to store the generated image
  const handleGenerateImage = async () => {
    try {
      const imageData = await generateImage(projectName, prompt, "userName");
      console.log(imageData);
      setGeneratedImage(imageData);
    } catch (error) {
      console.log('Error generating image:', error);
    }
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
  const [imageSatisfactory, setImageSatisfactory] = useState('option-one');
  const [imageUsability, setImageUsability] = useState('option-one');

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
  const [projectName, setProjectName] = useState('Jacket Design Ideas');
  const [prompt, setPrompt] = useState('An image of a denim jacket with floral embroidery');
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ffffff] to-[#e5e7eb] text-black">
      {/* Menu */}
      <div className="fixed left-0 right-0 top-0 z-50 flex w-full items-center justify-between bg-white px-4 py-2 shadow-md">
        <div className="flex items-center space-x-4">
          {/* Profile Pic and info */}
          <div className="h-10 w-10 rounded-full bg-gray-300"></div>
          {/* Replace with user name*/}
          <span className="text-lg font-semibold">Hi, user_name</span>
        </div>
        <div className="flex space-x-4">
          <Button className="text-sm-black bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg">Prompt History</Button>
          <Button className="text-sm-black bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg">Image Variations</Button>
          <Button className="text-sm-black bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg">Image Descriptions</Button>
        </div>
      </div>
      <h1 className="text-5xl font-bold mt-4">Stable Diffusion AI Agent</h1>
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
                  <div className="space-y-1 ml-6">
                    <Label htmlFor="name" className="text-base">Project Name</Label>
                    <Input id="name" className="italic text-gray-500 font-light text-base" defaultValue="Jacket Design Ideas" />
                  </div>
                  <div className="space-y-1 ml-6 mb-2">
                    <Label htmlFor="username" className="text-base">Prompt</Label>
                    <Input id="username" className="italic text-gray-500 font-light text-base" defaultValue="An image of a denim jacket with floral embroidery" />
                  </div>
                  <CardFooter className="">
                    {/* <Button className="text-base mt-4">Generate Image</Button> */}
                    {/* Generate Image */}
                    <Button className="text-base mt-4" onClick={handleGenerateImage}>Generate Image</Button>

                    {generatedImage && (
                      <div>
                        <h2>Generated Image</h2>
                        <img src={`data:image/jpeg;base64,${generatedImage}`} alt="Generated Image" />
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
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <Card className="p-4 bg-white w-[60%]">
              <CardContent className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="col-span-1 flex-col space-y-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">Image Survey</CardTitle>
                    <CardDescription className="text-lg">
                      Complete this survey to download your image.
                    </CardDescription>
                  </CardHeader>
                  <div className="space-y-1 ml-6">
                    <Label htmlFor="name" className="text-base">Do you find the generated image satisfactory to your needs? </Label>
                    <RadioGroup defaultValue="option-one">
                      <div className="flex items-center space-x-2 mb-7">
                        <RadioGroupItem value="option-one" id="option-one" />
                        <Label htmlFor="option-one">Yes</Label>
                        <RadioGroupItem value="option-two" id="option-two" onClick={handleNoClick} />
                        <Label htmlFor="option-two">No</Label>
                        <RadioGroupItem value="option-three" id="option-three" />
                        <Label htmlFor="option-three">Close but not quite</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-1 ml-6">
                    <Label htmlFor="username" className="text-base">Can the generated image be used directly for digital fabrication</Label>
                    <RadioGroup defaultValue="option-one">
                      <div className="flex items-center space-x-2 mb-4">
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
                        <a href="your-new-page-url" className="text-blue-500 underline-on-hover" >Advanced Image Variation Settings</a>
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
                    <div className="flex justify-center w-full mt-5" id="surveyDownload">
                      <Button className="flex space-x-2 #ffffff-text-thin" onClick={handleCloseCard}>
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
