import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Image, Video } from "lucide-react";

const ProductMediaSection: React.FC = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  // 🟢 Watch current images and video
  const images = watch("images");
  const video = watch("video");

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoName, setVideoName] = useState<string | null>(null);

  useEffect(() => {
    if (images && images.length > 0) {
      // If it's a FileList (new uploads)
      if (images instanceof FileList) {
        const urls = Array.from(images).map((file) =>
          URL.createObjectURL(file)
        );
        setImagePreviews(urls);
      } else if (Array.isArray(images)) {
        // If it's already uploaded URLs (edit mode)
        setImagePreviews(images);
      }
    } else {
      setImagePreviews([]);
    }
  }, [images]);

  useEffect(() => {
    if (video) {
      if (video instanceof File) {
        setVideoName(video.name);
      } else if (typeof video === "string") {
        setVideoName(video.split("/").pop() || null);
      }
    } else {
      setVideoName(null);
    }
  }, [video]);

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6">
      {/* Section Title */}
      <h3 className="text-base font-semibold text-gray-900">Product Media</h3>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Upload captivating images and videos to make your product stand out.
      </p>

      <div className="flex flex-col sm:flex-row items-stretch gap-6">
        {/* Image Upload Box */}
        <label
          htmlFor="images"
          className="flex-1 flex flex-col justify-center items-center border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition p-6 text-center relative"
        >
          <Image className="w-8 h-8 text-gray-500 mb-3" />
          <span className="text-sm font-medium text-gray-700">
            Upload images
          </span>
          <input
            type="file"
            multiple
            {...register("images")}
            id="images"
            className="hidden"
          />
          {typeof errors.images?.message === "string" && (
            <p className="text-xs text-red-500 mt-2">{errors.images.message}</p>
          )}

          {/* 🟢 Preview images */}
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {imagePreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`preview-${idx}`}
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </label>

        {/* Divider */}
        <div className="flex items-center justify-center text-gray-400 font-semibold">
          Or
        </div>

        {/* Video Upload Box */}
        <label
          htmlFor="video"
          className="flex-1 flex flex-col justify-center items-center border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition p-6 text-center relative"
        >
          <Video className="w-8 h-8 text-gray-500 mb-3" />
          <span className="text-sm font-medium text-gray-700">Add video</span>
          <input
            type="file"
            {...register("video")}
            id="video"
            className="hidden"
          />
          {typeof errors.video?.message === "string" && (
            <p className="text-xs text-red-500 mt-2">{errors.video.message}</p>
          )}

          {/* 🟢 Show video filename */}
          {videoName && (
            <p className="mt-4 text-sm text-gray-600">{videoName}</p>
          )}
        </label>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-400 mt-4 text-center sm:text-left">
        Recommended size:{" "}
        <span className="font-medium text-gray-600">1000px × 1248px</span>
      </p>
    </div>
  );
};

export default ProductMediaSection;
