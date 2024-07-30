import { Loader2 } from "lucide-react";
import Image from "next/image";

export const ImagePreview = ({
  isPending,
  imageUrl,
  title,
}: {
  isPending: boolean;
  imageUrl: string | null;
  title: string;
}) => {
  return (
    <div className="relative mt-7 flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100">
      {isPending ? (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="mt-2 text-lg font-bold text-gray-400">
            Loading Image...
          </span>
        </div>
      ) : imageUrl ? (
        <Image fill={true} src={imageUrl} alt={title} />
      ) : (
        <span className="text-lg font-bold text-gray-400">
          {title ?? "Image"}
        </span>
      )}
    </div>
  );
};
