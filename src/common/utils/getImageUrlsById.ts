type ImageVariants = {
  original: string;
  thumbnail: string;
  small: string;
  medium: string;
  large: string;
};

/**
 * Returns full URLs to different image variants for a given imageDiskName.
 * @param imageDiskName - e.g., "8baf0bff-4eda-419e-a3cd-c9a0efcb95f6.webp"
 * @param baseUrl - optional, defaults to current window.origin
 */
export function getImageUrlsById(
  imageDiskName: string | undefined,
  baseUrl: string = "http://localhost:3000"
): ImageVariants {
  return {
    original: `${baseUrl}/image/generated/original/${imageDiskName}`,
    thumbnail: `${baseUrl}/image/generated/thumbnail/${imageDiskName}`,
    small: `${baseUrl}/image/generated/small/${imageDiskName}`,
    medium: `${baseUrl}/image/generated/medium/${imageDiskName}`,
    large: `${baseUrl}/image/generated/large/${imageDiskName}`,
  };
}
