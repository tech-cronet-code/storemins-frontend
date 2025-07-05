import namer from "color-namer";

export const getColorName = (hex: string): string => {
  try {
    const result = namer(hex);
    return result.basic[0]?.name || hex;
  } catch {
    return hex;
  }
};

// utils/cleanObject.ts
export function removeEmptyStrings<T extends Record<string, any>>(obj: T): T {
  const cleaned = {} as T;

  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "string" && value.trim() === "") continue;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const nested = removeEmptyStrings(value);
      if (Object.keys(nested).length > 0) {
        cleaned[key] = nested;
      }
    } else if (value !== undefined) {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

