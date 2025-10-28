// config/environment.params.ts


// const Environment = ["development", "production"] as const;
export type TEnvironment = "development" | "production";

function baseUrlFrom(url: URL) {
  let ret = `${url.protocol}//${url.hostname}`;
  if (url.port && url.port !== "80" && url.port !== "443") {
    ret += `:${url.port}`;
  }
  return ret;
}

export const environmentParams = () => {
  let frontendBaseUrl: string | null = null;
  let env: TEnvironment = "development";

  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    console.log("Detected URL:", url);
    frontendBaseUrl = baseUrlFrom(url);

    if (
      ["cheddr.net", "www.cheddr.net"].some((sub) => url.hostname.includes(sub))
    ) {
      env = "production";
    } else {
      env = "development";
    }
  }

  // Dynamically resolve .env variable based on detected environment
  const publicApiUri =
    env === "production"
      ? import.meta.env.VITE_PUBLIC_API_URL_RUNTIME_LIVE
      : import.meta.env.VITE_PUBLIC_API_URL_RUNTIME_LOCAL;

  const wsPathRelativeToApi = import.meta.env.VITE_PUBLIC_WS_PATH as string;
  const configuredImageUrl = import.meta.env.VITE_PUBLIC_IMAGE_URL as string;

  const fullPublicApiUrl = new URL(
    publicApiUri.startsWith("http") ? publicApiUri : publicApiUri,
    window.location.origin
  );

  let schemaAndHostname = `${fullPublicApiUrl.protocol}//${fullPublicApiUrl.hostname}`;
  if (
    fullPublicApiUrl.port &&
    fullPublicApiUrl.port !== "80" &&
    fullPublicApiUrl.port !== "443"
  ) {
    schemaAndHostname += `:${fullPublicApiUrl.port}`;
  }
  console.log("fullPublicApiUrl:", fullPublicApiUrl);

  const pathname = fullPublicApiUrl.pathname.replace(/\/$/, "");
  console.log("Resolved pathname:", pathname);
  const wsPath = pathname + wsPathRelativeToApi;

  const imageBaseURL =
    configuredImageUrl?.startsWith("http") ||
    configuredImageUrl?.startsWith("https")
      ? configuredImageUrl
      : `${schemaAndHostname}${pathname}${configuredImageUrl}`;

  console.log(imageBaseURL, "---- Image Base URL");

  return {
    schemaAndHostname,
    publicApiUri,
    fullPublicApiUrl,
    wsPath,
    frontendBaseUrl,
    env,
    isProd: env === "production",
    isTest: env === "development",
    imageBaseURL,
  };
};
