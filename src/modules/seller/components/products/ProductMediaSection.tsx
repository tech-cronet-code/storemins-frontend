import React from "react";
import { useFormContext } from "react-hook-form";
import { Image, Video } from "lucide-react";

const ProductMediaSection: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

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
          className="flex-1 flex flex-col justify-center items-center border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition p-6 text-center"
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
        </label>

        {/* Divider */}
        <div className="flex items-center justify-center text-gray-400 font-semibold">
          Or
        </div>

        {/* Video Upload Box */}
        <label
          htmlFor="video"
          className="flex-1 flex flex-col justify-center items-center border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition p-6 text-center"
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
