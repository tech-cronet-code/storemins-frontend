// src/common/utils/useImagePath.ts
import { environmentParams } from "../config/environment.params";

const { imageBaseURL } = environmentParams();

/**
 * Explicitly-known variants for better IntelliSense + autocomplete.
 * Add common ones here; the template fallback `original/${string}` still allows any future path.
 */
export type KnownImageVariantExamples =
  | "original/auth"
  | "original/category"
  | "original/categories"
  | "original/products"
  | "original/products/featured"
  | "original/banners"
  | "original/brands";

/**
 * e.g. "original/auth", "original/category", "original/products/featured"
 * Also supports any "original/<anything>" via template literal,
 * plus "fallback" for serving public fallback assets.
 */
export type ImageVariant =
  | KnownImageVariantExamples
  | `original/${string}`
  | "fallback";

/** Default variant for profile avatars */
export const DEFAULT_IMAGE_VARIANT: ImageVariant = "original/auth";

/** Ensure the filename has an extension (defaults to .webp) */
function withExt(name: string) {
  return /\.[a-zA-Z0-9]+$/.test(name) ? name : `${name}.webp`;
}

/** Join with single slashes (avoid accidental `//`) */
function joinUrl(...parts: string[]) {
  return parts
    .filter(Boolean)
    .map((p) => String(p).replace(/^\/+|\/+$/g, "")) // trim leading/trailing slashes
    .join("/");
}

/**
 * Build a full image URL for a given disk name and variant.
 *
 * - `imageDiskName` can be with or without extension. If none, `.webp` is assumed.
 * - `variant` is typically something like:
 *    - "original/auth" (private avatars, if you’re exposing them publicly this is fine; otherwise use tokenized URLs)
 *    - "original/products", "original/category", etc.
 *    - any future path via `original/<any>`
 *    - "fallback" for files under your public fallback dir
 */
export function convertPath(
  imageDiskName?: string,
  variant: ImageVariant = DEFAULT_IMAGE_VARIANT
) {
  if (!imageDiskName) return undefined;
  const fileName = withExt(imageDiskName);
  return `${imageBaseURL}/${joinUrl(variant, fileName)}`;
}

/**
 * React-friendly helper that returns a usable URL (or the provided fallback).
 */
export function useImagePath(
  imageDiskName?: string,
  variant: ImageVariant = DEFAULT_IMAGE_VARIANT,
  fallback?: string
) {
  const fullUrl = convertPath(imageDiskName, variant);
  return { fullUrl: fullUrl || fallback, convertPath };
}
