import { environmentParams } from "../config/environment.params";

const { imageBaseURL } = environmentParams();

console.log("Image Base URL::::", imageBaseURL);

export type ImageVariant =
  | "original"
  | "generated/original"
  | "generated/large"
  | "generated/medium"
  | "generated/thumbnail"
  | "fallback";

export function convertPath(
  imageDiskName?: string,
  variant: ImageVariant = "original"
) {
  if (!imageDiskName) return undefined;

  const isGenerated = variant.startsWith("generated/");

  // Strip the file extension (.jpg, .png, etc.)
  const baseName = imageDiskName.replace(/\.[^/.]+$/, "");

  // Use .webp for generated variants, original filename otherwise
  const fileName = isGenerated ? `${baseName}.webp` : imageDiskName;

  // return `${imageBaseURL}/${variant}/${fileName}`;
  return `${imageBaseURL}/${variant}/${fileName}`;
}

export function useImagePath(
  imageDiskName?: string,
  variant?: ImageVariant,
  fallback?: string
) {
  const fullUrl = convertPath(imageDiskName, variant);
  return { fullUrl: fullUrl || fallback, convertPath };
}
