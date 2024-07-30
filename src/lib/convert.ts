const ensureBase64Padding = (base64String: string) => {
  // Add padding if necessary
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  return base64String + padding;
};

export const convertBlobToBase64 = async (url: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const base64String = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return ensureBase64Padding((base64String as string).split(",")[1]!);
  } catch (error) {
    console.error("Error converting Blob to Base64:", error);
    return null;
  }
};
