export const redirect = async ({
  url,
  baseUrl,
}: {
  url: string;
  baseUrl: string;
}) => {
  // Allows relative callback URLs
  if (url.startsWith("/")) return `${baseUrl}${url}`;
  // Allows callback URLs on the same origin
  else if (new URL(url).origin === baseUrl) return url;
  return baseUrl;
};
