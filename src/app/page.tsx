"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { CiImport } from "react-icons/ci";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"


//?
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z, ZodError } from 'zod';


// TO DO:
// - change htmlFor and values to not be password etc related
// - create variations page
// - survey and survey button 
// - UI points 8 and 9

export default function Home() {

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

  const handleDownloadClick = () => {
    setShowDownloadCard(true);
  };
  const handleCloseCard = () => {
    setShowDownloadCard(false);
  };
  const onSubmit = (data: any) => {
    console.log(data);
    setShowDownloadCard(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ffffff] to-[#e5e7eb] text-black">
      <h1 className="text-5xl font-bold mb-4">Stable Diffusion AI Agent</h1>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-12">

        <Tabs defaultValue="account" className="w-[80%] h-[auto]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Generate Image</TabsTrigger>
            <TabsTrigger value="password">Create Variations</TabsTrigger>
          </TabsList>
          {/*Generate Image Tab */}
          <TabsContent value="account">
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
                  <div className="space-y-1 ml-6">
                    <Label htmlFor="name" className="text-base">Project Name</Label>
                    <Input id="name" className="italic text-gray-500 font-light text-base" defaultValue="Jacket Design Ideas" />
                  </div>
                  <div className="space-y-1 ml-6">
                    <Label htmlFor="username" className="text-base">Prompt</Label>
                    <Input id="username" className="italic text-gray-500 font-light text-base" defaultValue="An image of a denim jacket with floral embroidery" />
                  </div>
                  <CardFooter className="">
                    <Button className="text-base mt-3">Generate Image</Button>
                  </CardFooter>
                </div>
                {/* Right Column */}
                <div className="col-span-1 space-y-5 flex flex-col items-center justify-center">
                  <div className="w-64 h-64 bg-gray-200 flex items-center justify-center mt-3">
                    <span className="text-lg font-bold">Generated Image</span>
                  </div>
                  {/* <p className="text-lg text-center mt-2">Placeholder for generated image</p> */}
                  {/* <div className="flex justify-end w-full mt-5 mr-6"> */}
                  <div className="flex justify-center w-full mt-5">

                    <Button className="flex space-x-2 #ffffff-text-thin" onClick={handleDownloadClick}>
                      <span>Download</span>
                      <CiImport className="text-xl" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Create Variation Tab*/}
          <TabsContent value="password">
            <Card>
              <CardContent className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="col-span-1 space-y-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">Create Image Variations</CardTitle>
                    <CardDescription className="text-lg">
                      Enter your project name and upload an image and prompt that you would like to see variations of.
                    </CardDescription>
                  </CardHeader>
                  <div className="space-y-1 ml-6">
                    <Label htmlFor="name" className="text-base">Project Name</Label>
                    <Input id="name" className="italic text-gray-500 font-light text-base" defaultValue="Bag Design Ideas" />
                  </div>
                  <div className="space-y-1 ml-6">
                    <Label htmlFor="username" className="text-base">Guiding Prompt</Label>
                    <Input id="username" className="italic text-gray-500 font-light text-base" defaultValue="Design a bag with this pattern" />
                  </div>
                  <div className="space-y-1 ml-6">
                    <Label htmlFor="file-upload" className="text-base">Upload Image</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      className="italic text-gray-500 font-light text-base hover:underline"
                      onChange={handleImageUpload}
                    />
                    {selectedImage && (
                      <div className="mt-2">
                        <img src={selectedImage} alt="Selected" className="w-64 h-64 object-cover" />
                      </div>
                    )}
                  </div>
                  <CardFooter className="">
                    <Button className="text-base mt-3">Create Variation</Button>
                  </CardFooter>
                </div>
                {/* Right Column */}
                <div className="col-span-1 space-y-3 flex flex-col items-center justify-center">
                  <div className="w-64 h-64 bg-gray-200 flex items-center justify-center mt-3">
                    <span className="text-lg font-bold">Generated Image</span>
                  </div>
                  <div className="flex justify-center w-full mt-5">

                    <Button className="flex space-x-2 #ffffff-text-thin" onClick={handleDownloadClick}>
                      <span>Download</span>
                      <CiImport className="text-xl" />
                    </Button>
                  </div>                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Download Card */}
        {showDownloadCard && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <Card className="p-4 bg-white w-[60%]">
              <CardContent className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="col-span-1 space-y-2 flex-col">
                  <CardHeader>
                    <CardTitle className="text-2xl">Image Survey</CardTitle>
                  </CardHeader>
                  <div className="space-y-1 ml-6">
                    <Label htmlFor="name" className="text-base">Do you find the generated image satisfactory to your needs? </Label>
                    <RadioGroup defaultValue="option-one">
                      <div className="flex items-center space-x-2 mb-3">
                        <RadioGroupItem value="option-one" id="option-one" />
                        <Label htmlFor="option-one">Yes</Label>
                        <RadioGroupItem value="option-two" id="option-two" />
                        <Label htmlFor="option-two">No</Label>
                        <RadioGroupItem value="option-three" id="option-three" />
                        <Label htmlFor="option-three">Close but not quite</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-1 ml-6">
                    <Label htmlFor="username" className="text-base">Can the generated image be used directly for digital fabrication</Label>
                    <RadioGroup defaultValue="option-one">
                      <div className="flex items-center space-x-2 mb-3">
                        <RadioGroupItem value="option-one" id="option-one" />
                        <Label htmlFor="option-one">Yes</Label>
                        <RadioGroupItem value="option-two" id="option-two" />
                        <Label htmlFor="option-two">No</Label>
                        <RadioGroupItem value="option-three" id="option-three" />
                        <Label htmlFor="option-three">Will need another tool</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <CardFooter className="">
                    <Button className="text-base mt-3">Send Survey</Button>
                  </CardFooter>
                </div>
                {/* Right Column */}
                <div className="col-span-1 space-y-3 flex flex-col items-center justify-center">
                  <div className="w-64 h-64 bg-gray-200 flex items-center justify-center mt-3">
                    <span className="text-lg font-bold">Generated Image</span>
                  </div>
                  <div className="flex justify-center w-full mt-5">
                    <Button className="flex space-x-2 #ffffff-text-thin" onClick={handleCloseCard}>
                      <span>Download</span>
                      <CiImport className="text-xl" />
                    </Button>
                  </div>                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main >
  );
}
