// hooks/useImageUpload.ts
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useUploadImageMutation } from "../services/authApi";
import { convertPath } from "../utils/useImagePath";

export type UseImageUploadReturnType = {
  imageUrl: string;
  imageId: string | undefined;
  imageDiskName: string | undefined;
  token: string | undefined;
  handleImageUpload: (
    file: File,
    role?: "userProfile" | "product"
  ) => Promise<void>;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
};

export const useImageUpload = (): UseImageUploadReturnType => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageId, setImageId] = useState<string | undefined>();
  const [imageDiskName, setImageDiskName] = useState<string | undefined>();
  const [token, setToken] = useState<string | undefined>();

  const [uploadImageApi] = useUploadImageMutation();

  const handleImageUpload = async (
    file: File,
    role: "userProfile" | "product" | "banner" = "userProfile"
  ) => {
    try {
      const localPreview = URL.createObjectURL(file);
      setImageUrl(localPreview); // ⏱️ Instant preview

      const formData = new FormData();
      formData.append("files", file);
      formData.append("role", role);

      const res = await uploadImageApi({ formData }).unwrap();
      console.log("Upload response:", res);

      if (!res || !Array.isArray(res) || !res[0]) {
        throw new Error("Invalid upload response format");
      }

      const { id, diskName, token } = res[0];
      setImageId(id);
      setImageDiskName(diskName);
      setToken(token);

      const realUrl = convertPath(diskName, "generated/thumbnail");

      // ⏳ Attempt to preload server-side URL before replacing local preview
      if (realUrl) {
        const img = new Image();
        img.onload = () => setImageUrl(realUrl);
        img.onerror = () => {
          console.warn("⚠️ Server image not ready yet, keeping local preview.");
        };
        img.src = realUrl;
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  return {
    imageUrl,
    imageId,
    imageDiskName,
    token,
    handleImageUpload,
    setImageUrl,
  };
};
