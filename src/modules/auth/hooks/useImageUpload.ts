import { useState } from "react";
import { toast } from "react-hot-toast";
import { useUploadImageMutation } from "../services/authApi";
import { convertPath } from "../utils/useImagePath";

export type UploadedFileInfo = {
  id: string;
  diskName: string;
  token: string;
};

export type UseImageUploadReturnType = {
  imageUrl: string;
  imageId: string | undefined;
  imageDiskName: string | undefined;
  token: string | undefined;
  handleImageUpload: (
    file: File,
    overrideRole?: string,
    targetId?: string
  ) => Promise<UploadedFileInfo | null>; // 🔁 changed return type
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
};

/**
 * Custom image upload hook with role + targetId support
 */
export const useImageUpload = (
  defaultRole: string = "userProfile"
): UseImageUploadReturnType => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageId, setImageId] = useState<string | undefined>();
  const [imageDiskName, setImageDiskName] = useState<string | undefined>();
  const [token, setToken] = useState<string | undefined>();

  const [uploadImageApi] = useUploadImageMutation();

  const handleImageUpload = async (
    file: File,
    overrideRole?: string,
    targetId?: string
  ): Promise<UploadedFileInfo | null> => {
    try {
      const localPreview = URL.createObjectURL(file);
      setImageUrl(localPreview);

      const formData = new FormData();
      formData.append("files", file);
      formData.append("role", overrideRole || defaultRole);
      if (targetId) formData.append("targetId", targetId);

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
      if (realUrl) {
        const img = new Image();
        img.onload = () => setImageUrl(realUrl);
        img.onerror = () => console.warn("⚠️ Server image not ready yet.");
        img.src = realUrl;
      }

      return { id, diskName, token }; // ✅ returns UploadedFileInfo
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image. Please try again.");
      return null; // ✅ use null instead of undefined
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
