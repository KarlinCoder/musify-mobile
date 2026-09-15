declare module "jpeg-js" {
  export interface DecodeOptions {
    colorTransform?: boolean;
    useTArray?: boolean;
    formatAsRGBA?: boolean;
    tolerantDecoding?: boolean;
    maxResolutionInMP?: number;
    maxMemoryUsageInMB?: number;
  }

  export interface DecodedImage {
    width: number;
    height: number;
    data: Uint8Array;
    exifBuffer?: ArrayBuffer;
    comments?: string[];
  }

  export function decode(
    data: Uint8Array,
    options?: DecodeOptions,
  ): DecodedImage;
}