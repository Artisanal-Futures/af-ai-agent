import type { Dispatch, SetStateAction } from "react";

export const handleImageUpload = (props: {
  e: React.ChangeEvent<HTMLInputElement>;
  setSelectedImage: Dispatch<SetStateAction<string | null>>;
}) => {
  const file = props.e.target.files?.[0];
  if (file) {
    props.setSelectedImage(URL.createObjectURL(file));
  }
};
