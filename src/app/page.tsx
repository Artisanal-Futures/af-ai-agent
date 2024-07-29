"use client";
import { create } from "domain";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useId, useState } from "react";
import { useQuery } from 'react-query';
// import { useState } from "react";
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
import { Slider } from "~/components/ui/slider"
import { PastGenerations } from "~/types/agent";
import { PastVariations } from "~/types/agent";




export default function Home() {
  let BASEURL = "http://35.1.114.178:8000/";

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

  //image generate
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const defaultImagePath =
    "/img/stable-diffusion-xl--f7d3df13d07a4c4abe50690e4a994336.png";
  const handleGenerateImage = async () => {
    try {
      const response = await generateImage.mutateAsync({
        project_title: projectName,
        prompt: prompt,
        user_id: "cly90u3wp000aqw0j91enuc0f",
      });
      const imageData = JSON.parse(response);
      console.log(imageData);
      console.log(imageData.image_url);
      let fullImageUrl = BASEURL + imageData.image_url;
      console.log(fullImageUrl);
      setGeneratedImage(fullImageUrl);
    } catch (error) {
      console.error("Failed to generate image:", error);
      setGeneratedImage(defaultImagePath);
    }
    // await generateImage.mutateAsync({
    //   project_title: projectName,
    //   prompt: prompt,
    //   user_id: session?.user?.name ?? "user",
    // });
  };
  const [negativePrompt, setNegativePrompt] = useState<string>("low resolution, blurry image...");
  const [regeneratedImage, setRegeneratedImage] = useState<string>("");

  const regenerateImage = api.agent.regenerateImage.useMutation({
    onSuccess: (imageData) => {
      console.log("Image regenerated successfully");
      setRegeneratedImage(imageData);
    },
    onError: (error) => {
      console.error("Error regenerating image:", error);
      // setRegeneratedImage(defaultImagePath);
      setRegeneratedImage("test");

    },
  });

  const handleRegenerateImage = async () => {
    try {
      const imageData = await regenerateImage.mutateAsync({
        project_title: projectName,
        prompt: prompt,
        // user_id: 1,
        user_id: "cly90u3wp000aqw0j91enuc0f",
        guidance_scale: guidanceScale,
        negative_prompt: negativePrompt,
      });
      setRegeneratedImage(imageData)
    } catch (error) {
      console.error("Failed to regenerate image:", error);
      setRegeneratedImage(defaultImagePath);
    }
  };
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

  const [generatedVariation, setGeneratedVariation] = useState<string>("");
  const [projectName2, setProjectName2] = useState<string>("Bag Design Ideas");
  const [guidancePrompt, setGuidancePrompt] = useState<string>(
    "Design a bag with this pattern",
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const image = selectedImage ?? defaultImagePath;
  const handleCreateImageVariation = async () => {
    try {
      const varData = await createImageVariation.mutateAsync({
        guidance_prompt: guidancePrompt,
        project_title: projectName2,
        // user_id: 1,
        user_id: "cly90u3wp000aqw0j91enuc0f",
        input_image: image, // Assuming you have the base64 string of the input image
      });
      setGeneratedVariation(varData);
    } catch (error) {
      console.error("Failed to create image variation:", error);
      setGeneratedVariation(defaultImagePath);
    }
  };

  //File Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  //for styles card
  // const [uploadedStyles, setUploadedStyles] = useState([]);
  const [styleName, setStyleName] = useState<string>("");

  const handleStyleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStyleName(event.target.value);
  };

  //past generations
  const [pastGenerations, setPastGenerations] = useState<PastGenerations>([]);
  //how to process:
  const fetchPastGenerations = async () => {
    try {
      const result = await api.agent.listGenerations.useQuery();
      if (result.data) {
        setPastGenerations(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch past generations:", error);
    }
  };

  //past Variations
  const [pastVariations, setPastVariations] = useState<PastVariations>([]);
  //how to process:
  const fetchPastVariations = async () => {
    try {
      const result = await api.agent.listVariations.useQuery();
      if (result.data) {
        setPastVariations(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch past variations:", error);
    }
  };


  // NST file uplaod
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

  //Survey
  const [showDownloadCard, setShowDownloadCard] = useState(false);
  const [showSurveyDownload, setShowSurveyDownload] = useState(false);
  const handleDownloadClick = (imageUrl: string) => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = imageUrl.split('/').pop() ?? "test";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('No URL provided for download.');
    }
  };

  //Past Prompts card
  const [showPastGens, setShowPastGens] = useState(false);

  const handlePastGens = () => {
    setShowPastGens(true);
  };

  //Image Variations card
  const [showImageVars, setshowImageVars] = useState(false);

  const handleImageVars = () => {
    setshowImageVars(true);
  };

  //Regenerate Card
  const [showRegenerate, setShowRegenerate] = useState(false);

  const handleshowRegenerate = () => {
    setShowRegenerate(true);
  };

  const [guidanceScale, setGuidanceScale] = useState<number>(8.3);

  const handleSliderChange = (value: number[]) => {
    console.log(value);
    if (value.length > 0) {
      setGuidanceScale(value[0] ?? 0);
    }
  };

  //Your Styles card
  const [showStylesCard, setShowStylesCard] = useState(false);

  const handleStylesCard = () => {
    setShowStylesCard(true);
  };

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<{ src: string; name: string }[]>([]);

  const handleStyleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const newSelectedImages = files.map(file => URL.createObjectURL(file));
    setSelectedImages(newSelectedImages);

    const newUploadedImages = files.map(file => ({
      src: URL.createObjectURL(file),
      name: file.name,
    }));
    setUploadedImages([...newUploadedImages]);
  };


  const handleCloseCard = () => {
    setShowDownloadCard(false);
    setShowPastGens(false);
    setshowImageVars(false);
    setShowRegenerate(false);
    setShowStylesCard(false);
  };


  const [showLink, setShowLink] = useState(false);

  const handleNoClick = () => {
    setShowLink(true);
  };

  // survey submit
  const [imageSatisfactory, setImageSatisfactory] = useState("option-one");
  const [imageUsability, setImageUsability] = useState("option-one");

  const handleSurveyDownloadClick = () => {
    const surveyResponses = {
      imageSatisfactory,
      imageUsability,
    };

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
    const aiFormResponses = {
      projectName,
      prompt,
    };
    console.log(aiFormResponses);

    // Close the survey card if needed
    //setShowDownloadCard(false);
  };

  const { data: session } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ffffff] to-[#e5e7eb] text-black">
      {/* Menu */}
      <div className="z-100 fixed left-0 right-0 top-0 mb-5 flex w-full items-center justify-between bg-white px-4 py-2 shadow-md">
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
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                onClick={handlePastGens}
                className="text-sm-black rounded-lg bg-gray-200 px-3 py-1 hover:bg-gray-300"
              >
                Past Generations
              </Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-center text-sm">
                View your past image generations here
              </p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                onClick={handleImageVars}
                className="text-sm-black rounded-lg bg-gray-200 px-3 py-1 hover:bg-gray-300"
              >
                Image Variations
              </Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-center text-sm">
                View images you have created
              </p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Button onClick={handleStylesCard} className="text-sm-black rounded-lg bg-gray-200 px-3 py-1 hover:bg-gray-300">
                Your Styles
              </Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-center text-sm">
                Upload and save styles to use in style transfers
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
      <h1 className="mt-16 text-5xl font-bold md:mt-16">
        Artisanal&apos;s AI Agent
      </h1>
      <div className="container flex h-[calc(100%-5rem)] flex-col items-center justify-center gap-12 px-4 py-12">
        <Tabs defaultValue="generate" className="h-[auto] w-[90%]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">Generate Image</TabsTrigger>
            <TabsTrigger value="variation">Create Variations</TabsTrigger>
            <TabsTrigger value="style_transfer">Style Transfer</TabsTrigger>
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
                      {generateImage.isPending
                        ? "Generating..."
                        : "Generate Image"}
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
                    <Button
                      className="#ffffff-text-thin flex space-x-2 mr-4"
                      onClick={() => handleDownloadClick(generatedImage)}
                      disabled={generateImage.isPending || !generatedImage}
                    >
                      <span>Download</span>
                      <CiImport className="text-xl" />
                    </Button>

                    <Button
                      className="#ffffff-text-thin flex space-x-2"
                      onClick={handleshowRegenerate}
                      disabled={generateImage.isPending || !generatedImage}
                    >
                      <span>Regenerate Image</span>
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
                    <Button
                      className="#ffffff-text-thin flex space-x-2"
                      onClick={() => handleDownloadClick(generatedVariation)}
                      disabled={createImageVariation.isPending || !generatedVariation}
                    >
                      <span>Download</span>
                      <CiImport className="text-xl" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/*Style Transfer Tab */}
          <TabsContent value="style_transfer">
            <Card>
              <CardContent className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="col-span-1 space-y-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      Neural Style Transfer
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Enter two images. One of your content and another of a
                      style you would like to apply to your content.
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
                    <Button
                      className="#ffffff-text-thin flex space-x-2"
                    // onClick={handleDownloadClick}
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
              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleCloseCard}
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

        {/* Past Generations Card */}
        {showPastGens && (
          <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <Card className="relative w-[60%] bg-white p-4">
              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleCloseCard}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &#x2715;
                </button>
              </div>
              <CardContent>
                <CardHeader>
                  <CardTitle>Past Prompts and Generations</CardTitle>
                  <CardDescription className="text-lg">
                    Here you can view your previous prompts and outputs.
                  </CardDescription>
                </CardHeader>
                <div className="ml-6 mr-6">
                  <SessionDropDownMenu hasSession={!!session} sessionData={session} />
                  {session ? (
                    <>
                      <div>Past Generations for: {session.user.name}</div>
                      {/* Container for past prompts/images */}
                      <div className="max-h-96 overflow-y-auto mt-4">
                        {pastGenerations.length > 0 ? (
                          <ul>
                            {pastGenerations.map((generation, index) => (
                              <li key={index} className="mb-4">
                                <div className="flex flex-col md:flex-row items-start md:items-center">
                                  <img
                                    src={generation.image_url}
                                    alt={generation.project_title}
                                    className="w-32 h-32 mr-4 mb-4 md:mb-0"
                                  />
                                  <div>
                                    <h3 className="text-lg font-semibold">{generation.project_title}</h3>
                                    <p>{generation.prompt}</p>
                                    <p className="text-sm text-gray-500">
                                      Generated on: {new Date(generation.generation_date).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div>No past generations available.</div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div>
                      <div>
                        Login to save your work
                        <SignInButton className="ml-4" hasSession={!!session} />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Image Variations card*/}
        {showImageVars && (
          <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <Card className="relative w-[80%] bg-white p-4">
              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleCloseCard}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &#x2715;
                </button>
              </div>
              <CardContent>
                <CardHeader>
                  <CardTitle>Image Variations</CardTitle>
                  <CardDescription className="text-lg">
                    Here you can view your past created variations.
                  </CardDescription>
                </CardHeader>
                <div className="mt-4 ml-6 grid grid-cols-1 gap-4">
                  {/* Column Labels */}
                  <div className="grid grid-cols-3 gap-4 border-b border-gray-300 pb-2">
                    <div className="text-lg font-semibold">Project</div>
                    <div className="text-lg font-semibold">Base</div>
                    <div className="text-lg font-semibold">Result</div>
                  </div>
                  {pastVariations.length > 0 ? (
                    pastVariations.map((variation, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-4 border border-gray-300 bg-gray-200 p-4"
                      >
                        <div className="flex flex-col justify-center">
                          <h3 className="text-lg font-semibold">{variation.project_title}</h3>
                          <p>{variation.prompt}</p>
                          <p className="text-sm text-gray-500">
                            Generated on: {new Date(variation.generation_date).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="mt-7 flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100">
                            {variation.input_image_url ? (
                              <img
                                src={variation.input_image_url}
                                alt={`Base: ${variation.project_title}`}
                                className="object-cover h-full w-full"
                              />
                            ) : (
                              <span className="text-gray-500">No Base Image</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="mt-7 flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100">
                            {variation.output_image_url ? (
                              <img
                                src={variation.output_image_url}
                                alt={`Variation: ${variation.project_title}`}
                                className="object-cover h-full w-full"
                              />
                            ) : (
                              <span className="text-gray-500">No Result Image</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="grid grid-cols-3 gap-4 p-4">
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-gray-500">No Project</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="mt-7 flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100">
                          <span className="text-gray-500">No Base Image</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="mt-7 flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100">
                          <span className="text-gray-500">No Result Image</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <SessionDropDownMenu hasSession={!!session} sessionData={session} />
                {session ? (
                  <>
                    <div className="mt-3">Images for: {session.user.name}</div>
                  </>
                ) : (
                  <div>
                    <div className="mt-3">
                      Login to save your work
                      <SignInButton className="ml-4" hasSession={!!session} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}


        {/* Your Styles Card */}
        {showStylesCard && (
          <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <Card className="relative w-[60%] bg-white p-4">
              {/* Close Button */}
              <div className="flex justify-end">
                <button onClick={handleCloseCard} className="text-gray-500 hover:text-gray-700">
                  &#x2715;
                </button>
              </div>
              <CardContent>
                <CardHeader>
                  <CardTitle>Your Styles</CardTitle>
                  <CardDescription className="text-lg">
                    Upload style images to use in style transfers.
                  </CardDescription>
                </CardHeader>

                {/* Upload Image and Style Name */}
                <div className="ml-6 space-y-1">
                  <Label htmlFor="file-upload" className="text-base">
                    Upload Image
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    className="text-base font-light italic text-gray-500 hover:underline"
                    onChange={handleStyleUpload}
                    multiple
                  />
                  {selectedImages.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 gap-4">
                      {selectedImages.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Selected ${index}`}
                          className="h-32 w-32 object-cover"
                        />
                      ))}
                    </div>
                  )}
                  <Button onClick={() => setStyleName('')}>Upload Image</Button>
                </div>

                {/* Display Uploaded Images */}
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <img
                        src={image.src}
                        alt={image.name}
                        className="h-32 w-32 object-cover border border-gray-300"
                      />
                      <span className="mt-2 text-center">{image.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}


        {/* Regenerate Image Card */}
        {showRegenerate && (
          <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <Card>
              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleCloseCard}
                  className="text-gray-500 hover:text-gray-700 mr-3 mt-1"
                >
                  &#x2715;
                </button>
              </div>
              <CardContent className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="col-span-1 space-y-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">Regenerate Image</CardTitle>
                    <CardDescription className="text-lg">
                      Regenerate your image by providing a new negative prompt <br />
                      and adjusting the guidance scale. This allows you to refine <br />
                      the image output based on different constraints and preferences.<br />
                    </CardDescription>

                  </CardHeader>
                  <div className="ml-6 space-y-1 mb-4">
                    <Label className="text-base">
                      Project Name :
                      <span className="text-base font-light italic text-gray-500 ml-2">{projectName}</span>
                    </Label>
                  </div>
                  <div className="ml-6 space-y-1 mb-4">
                    <Label className="text-base">
                      Previous Prompt
                      <span className="text-base font-light italic text-gray-500 ml-2">{prompt}</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1 mb-4 ml-6">
                    <Label className="text-base flex items-center">
                      Negative Prompt
                    </Label>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button
                          className="w-6 h-6 p-0 flex items-center justify-center rounded-full border border-black bg-white text-black-700 text-xs font-semibold hover:bg-gray-200"
                          aria-label="Information"
                        >
                          <span className="italic">i</span>
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent side="right" align="center">
                        <p className="text-center text-sm">
                          This parameter specifies what you don&apos;t want to see in the generated images. Use this to guide and correct parts of your previously generated image. <br /> Ex: remove blur, shade, etc...
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <div className="flex items-center spacse-x-1 mb-4 ml-6">
                    <Input
                      id="username"
                      className="text-base font-light italic text-gray-500"
                      defaultValue="Design a bag with this pattern"
                      onChange={(e) => setNegativePrompt(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-1 mb-4 ml-6">
                    <Label className="text-base flex items-center">
                      Guidance Scale: <span className="font-medium ml-1">{guidanceScale}</span>
                    </Label>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button
                          className="ml-2 w-6 h-6 p-0 flex items-center justify-center rounded-full border border-black bg-white text-black-700 text-xs font-semibold hover:bg-gray-200"
                          aria-label="Information"
                        >
                          <span className="italic">i</span>
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent side="right" align="center">
                        <p className="text-center text-sm">
                          This parameter affects how much the prompt influences image generation. A lower value gives the model &quot;creativity&quot; to generate images that are more loosely related to the prompt.<br /> A higher guidance scale value pushes the model to follow the prompt more closely. <br /> 8.3 is the recommended value.
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <div className="flex items-center spacse-x-1 mb-4 ml-6">
                    <Slider
                      defaultValue={[guidanceScale]}
                      max={10}
                      step={0.1}
                      onValueChange={handleSliderChange}
                      className="mt-2"
                    />
                  </div>

                  <CardFooter className="">
                    {/* <Button className="text-base mt-4">Generate Image</Button> */}
                    {/* Generate Image */}
                    <Button
                      className="mt-4 text-base"
                      onClick={handleRegenerateImage}
                      disabled={regenerateImage.isPending}
                    >
                      {regenerateImage.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      {regenerateImage.isPending
                        ? "Regenerating..."
                        : "Regenerate Image"}
                    </Button>
                  </CardFooter>
                </div>
                {/* Right Column */}
                <div className="col-span-1 flex flex-col items-center justify-center space-y-5">
                  {/* previous image */}
                  <Label className="text-base">
                    Previous Image
                  </Label>
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
                  {/* new image */}
                  <Label className="text-base">
                    Regenerated Image
                  </Label>
                  <div className="mt-7 flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100">
                    {/* <span className="text-lg font-bold text-gray-300">Generated Image</span> */}
                    {regenerateImage.isPending ? (
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        <span className="mt-2 text-lg font-bold text-gray-400">
                          Loading Image...
                        </span>
                      </div>
                    ) : regenerateImage ? (
                      <img
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
                    <Button
                      className="#ffffff-text-thin flex space-x-2 mr-4"
                      onClick={() => handleDownloadClick(regeneratedImage)}
                      disabled={regenerateImage.isPending || !regenerateImage}
                    >
                      <span>Download</span>
                      <CiImport className="text-xl" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        )}
      </div>
    </main >
  );
}
