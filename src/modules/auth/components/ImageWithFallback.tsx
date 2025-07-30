// components/ImageWithFallback.tsx
import React, { useEffect, useState } from "react";

interface Props {
  src?: string;
  fallback?: string;
  alt?: string;
  className?: string;
}

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 400; // ms

export const ImageWithFallback: React.FC<Props> = ({
  src,
  fallback = "/fallback/user/userImage.png",
  alt = "Preview",
  className,
}) => {
  const [imageSrc, setImageSrc] = useState<string>();
  const [triedOriginalExtension, setTriedOriginalExtension] = useState(false);

  const cacheBust = (url: string) => {
    const u = new URL(url, window.location.origin);
    u.searchParams.set("t", Date.now().toString());
    return u.toString();
  };

  const retryLoading = (url: string, count = 0) => {
    const bustedUrl = cacheBust(url);
    const img = new Image();

    img.onload = () => {
      console.log("✅ Image loaded after retry:", bustedUrl);
      setImageSrc(bustedUrl);
    };

    img.onerror = () => {
      if (count < MAX_RETRIES) {
        console.warn(`⏳ Retry ${count + 1} for`, bustedUrl);
        setTimeout(() => retryLoading(url, count + 1), RETRY_INTERVAL);
      } else {
        console.warn("⚠️ Max retries reached. Falling back.");
        handleError();
      }
    };

    img.src = bustedUrl;
  };

  useEffect(() => {
    if (src) {
      setTriedOriginalExtension(false);
      retryLoading(src);
    }
  }, [src]);

  const handleError = () => {
    if (!triedOriginalExtension && src?.endsWith(".webp")) {
      const jpgFallback = src.replace(/\.webp$/, ".jpg");
      console.warn("🔁 .webp failed, trying .jpg:", jpgFallback);
      setTriedOriginalExtension(true);
      retryLoading(jpgFallback);
    } else {
      const fallbackUrl = cacheBust(fallback);
      console.warn("❌ Falling back to static fallback:", fallbackUrl);
      setImageSrc(fallbackUrl);
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      onError={handleError}
      onLoad={() => console.log("✅ Final image loaded:", imageSrc)}
      className={className || "object-cover rounded-md"}
    />
  );
};
