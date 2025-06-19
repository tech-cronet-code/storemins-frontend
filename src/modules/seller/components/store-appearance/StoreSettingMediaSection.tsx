import React, { useEffect, useState } from "react";
import { Image } from "lucide-react";

const StoreSettingMediaSection: React.FC = () => {
  const [images, setImages] = useState<FileList | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoName, setVideoName] = useState<string | null>(null);

  // Generate image previews
  useEffect(() => {
    if (images) {
      const urls = Array.from(images).map((file) => URL.createObjectURL(file));
      setImagePreviews(urls);
    } else {
      setImagePreviews([]);
    }
  }, [images]);

  useEffect(() => {
    if (video) {
      setVideoName(video.name);
    } else {
      setVideoName(null);
    }
  }, [video]);

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6">
      {/* Section Title */}
      <h3 className="text-base font-semibold text-gray-900">Store Media</h3>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Upload captivating images and Favicon icon to make your store stand out.
      </p>

      <div className="flex flex-col sm:flex-row items-stretch gap-6">
        {/* Store Logo Image Upload Box */}
        <label className="flex-1 flex flex-col justify-center items-center border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition p-6 text-center relative">
          <Image className="w-8 h-8 text-gray-500 mb-3" />
          <span className="text-sm font-medium text-gray-700">
            Upload Store Logo
          </span>
          <input
            type="file"
            multiple
            onChange={(e) => setImages(e.target.files)}
            className="hidden"
          />

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
          <p className="text-xs text-gray-400 mt-4 text-center sm:text-left">
            JPG/PNG Image:{" "}
            <span className="font-medium text-gray-600">
              (Minimum Height: 256 px)
            </span>
          </p>
        </label>

        {/* Favicon Upload Box */}
        <label className="flex-1 flex flex-col justify-center items-center border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition p-6 text-center relative">
          <Image className="w-8 h-8 text-gray-500 mb-3" />
          <span className="text-sm font-medium text-gray-700">Add Favicon</span>
          <input
            type="file"
            onChange={(e) => setVideo(e.target.files?.[0] || null)}
            className="hidden"
          />

          {videoName && (
            <p className="mt-4 text-sm text-gray-600">{videoName}</p>
          )}
          <p className="text-xs text-gray-400 mt-4 text-center sm:text-left">
            PNG Image Only:{" "}
            <span className="font-medium text-gray-600">(512x512 px)</span>
          </p>
        </label>
      </div>
    </div>
  );
};

export default StoreSettingMediaSection;
