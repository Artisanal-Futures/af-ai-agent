import type { Session } from "next-auth";
import Image from "next/image";
import { useState } from "react";
import { SessionDropDownMenu } from "~/app/(auth)/_components/session-dropdown-menu";
import { SignInButton } from "~/app/(auth)/_components/sign-in-button";
import { Button } from "~/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

// import { api } from "~/trpc/react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function StyleHistoryDialog(props: {
  session: Session | null;
  demo?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [styleName, setStyleName] = useState<string>("");

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<
    { src: string; name: string }[]
  >([]);

  // const fetchStyleImages = api.agent.listStyleImages.useQuery(
  //   {
  //     user_id: props.session?.user.id ?? "",
  //     demo: props?.demo,
  //   },
  //   {
  //     enabled: !!props.session?.user.id && open,
  //   },
  // );

  const handleStyleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const newSelectedImages = files.map((file) => URL.createObjectURL(file));
    setSelectedImages(newSelectedImages);

    const newUploadedImages = files.map((file) => ({
      src: URL.createObjectURL(file),
      name: file.name,
    }));
    setUploadedImages([...newUploadedImages]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-sm-black rounded-lg bg-gray-200 px-3 py-1 hover:bg-gray-300"
        >
          Your Styles
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[60%]">
        <DialogHeader>
          <DialogTitle>Your Styles</DialogTitle>
          <DialogDescription className="text-lg">
            Upload style images to use in style transfers.
          </DialogDescription>
        </DialogHeader>

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
                <div key={index} className="relative h-32 w-32">
                  <Image
                    fill={true}
                    src={image}
                    alt={`Selected ${index}`}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          <Button onClick={() => setStyleName("")}>Upload Image</Button>
        </div>

        {/* Display Uploaded Images */}
        <div className="mt-4 grid grid-cols-4 gap-4">
          {uploadedImages.map((image, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative h-32 w-32 border border-gray-300">
                <Image
                  fill={true}
                  src={image.src}
                  alt={image.name}
                  className=" object-cover"
                />
              </div>
              <span className="mt-2 text-center">{image.name}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
