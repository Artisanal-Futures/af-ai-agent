import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"

// TO DO:
// - change htmlFor and values to not be password etc related
// - create variations page
// - survey and survey button 
// - UI points 8 and 9

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ffffff] to-[#e5e7eb] text-black">
      <h1 className="text-5xl font-bold mb-8">Stable Diffusion AI Agent</h1>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-12">

        <Tabs defaultValue="account" className="w-[80%] h-[auto]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Generate Image</TabsTrigger>
            <TabsTrigger value="password">Create Variations</TabsTrigger>
          </TabsList>
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
                <div className="col-span-1 space-y-3 flex flex-col items-center justify-center">
                  <div className="w-64 h-64 bg-gray-200 flex items-center justify-center mt-3">
                    <span className="text-lg font-bold">Generated Image</span>
                  </div>
                  <p className="text-lg text-center mt-2">Placeholder for generated image</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardContent className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="col-span-1 space-y-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">Create Image Variations</CardTitle>
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
                <div className="col-span-1 space-y-3 flex flex-col items-center justify-center">
                  <div className="w-64 h-64 bg-gray-200 flex items-center justify-center mt-3">
                    <span className="text-lg font-bold">Generated Image</span>
                  </div>
                  <p className="text-lg text-center mt-2">Placeholder for generated image</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
