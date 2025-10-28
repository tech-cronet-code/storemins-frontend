// components/UploadImage.tsx
import React, { useEffect, useState } from "react";
import { useImageUpload } from "../hooks/useImageUpload";
import { ImageWithFallback } from "./ImageWithFallback";
import { convertPath, ImageVariant } from "../utils/useImagePath";

export const UploadImage = () => {
  const { imageDiskName, handleImageUpload, imageId } = useImageUpload();

  const [selectedVariant, setSelectedVariant] = useState<ImageVariant>(
    "generated/thumbnail"
  );

  const [delayedImageUrl, setDelayedImageUrl] = useState<string | undefined>();

  // Delay setting image URL so backend has time to process
  useEffect(() => {
    if (imageDiskName) {
      const resolved = convertPath(imageDiskName, selectedVariant);
      console.log("🖼️ Resolved Image URL:", resolved);

      setDelayedImageUrl(undefined); // Clear before setting new one

      const timeout = setTimeout(() => {
        setDelayedImageUrl(resolved); // Set after delay
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [imageDiskName, selectedVariant]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      await handleImageUpload(file, "userProfile");
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleChange} />

      <select
        value={selectedVariant}
        onChange={(e) =>
          setSelectedVariant(e.target.value as typeof selectedVariant)
        }
        className="border p-1 rounded"
      >
        <option value="generated/thumbnail">Thumbnail</option>
        <option value="generated/medium">Medium</option>
        <option value="generated/large">Large</option>
        <option value="original">Original</option>
      </select>

      {!delayedImageUrl ? (
        <div className="w-40 h-40 bg-gray-100 rounded-md animate-pulse" />
      ) : (
        <ImageWithFallback
          src={delayedImageUrl}
          fallback="/fallback/user/userImage.png"
          className="w-40 h-40 border"
        />
      )}

      {imageId && <p className="text-sm text-gray-600">Image ID: {imageId}</p>}
    </div>
  );
};
