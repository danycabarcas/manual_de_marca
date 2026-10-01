export interface MagdalenaTokens {
  version: string;
  colors: Record<string, { hex: string; rgb: number[]; cmyk: number[]; role: string }>;
  neutrals: Record<string, string>;
  scales: Record<string, Record<string, string>>;
  semantic: Record<string, string>;
  stripe: string[];
  gradients: Record<string, string>;
  fonts: Record<string, string>;
  googleFonts: string;
  radius: Record<string, string>;
  shadow: Record<string, string>;
}
export declare const magdalena: MagdalenaTokens;
export default magdalena;
