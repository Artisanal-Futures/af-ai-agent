import { CiImport } from "react-icons/ci";
import { downloadImage } from "~/lib/download";
import { Button } from "./ui/button";

export const DownloadButton = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <Button
      className="#ffffff-text-thin flex space-x-2"
      onClick={() => void downloadImage(imageUrl)}
    >
      <span>Download</span>
      <CiImport className="text-xl" />
    </Button>
  );
};
