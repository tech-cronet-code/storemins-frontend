declare module "color-namer" {
  interface NamedColor {
    name: string;
    hex: string;
    distance: number;
  }

  interface NamerResult {
    basic: NamedColor[];
    html: NamedColor[];
    pantone: NamedColor[];
    roygbiv: NamedColor[];
  }

  export default function namer(hex: string): NamerResult;
}
