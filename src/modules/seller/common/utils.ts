import namer from "color-namer";

export const getColorName = (hex: string): string => {
  try {
    const result = namer(hex);
    return result.basic[0]?.name || hex;
  } catch {
    return hex;
  }
};
