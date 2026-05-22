/**
 * watermark.ts — Blur watermarks on downloaded images
 *
 * WeChat articles often have watermarks at bottom-right corner.
 * This module applies Gaussian blur to the watermark region.
 */

import sharp from "sharp";

export interface WatermarkOptions {
  /** Height of blur region at bottom (default: 40px) */
  bottomHeight?: number;
  /** Width ratio of blur region from right (default: 0.5 = right half) */
  rightWidthRatio?: number;
  /** Gaussian blur sigma (default: 10) */
  blurSigma?: number;
}

const DEFAULT_OPTIONS: Required<WatermarkOptions> = {
  bottomHeight: 50,
  rightWidthRatio: 0.5,
  blurSigma: 20,
};

/**
 * Blur the bottom-right region of an image to hide watermarks.
 * Returns the processed image buffer in the same format.
 */
export async function blurWatermark(
  inputBuffer: Buffer,
  options: WatermarkOptions = {}
): Promise<Buffer> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const metadata = await sharp(inputBuffer).metadata();
  const { width, height, format } = metadata;

  if (!width || !height) return inputBuffer;

  // Define the region to blur (bottom-right corner)
  const regionLeft = Math.floor(width * (1 - opts.rightWidthRatio));
  const regionTop = height - opts.bottomHeight;

  // Create blurred version
  const blurred = await sharp(inputBuffer)
    .extract({
      left: regionLeft,
      top: regionTop,
      width: width - regionLeft,
      height: opts.bottomHeight,
    })
    .blur(opts.blurSigma)
    .toBuffer();

  // Composite the blurred region back onto the original
  const result = await sharp(inputBuffer)
    .composite([{
      input: blurred,
      left: regionLeft,
      top: regionTop,
    }])
    .toBuffer();

  return result;
}

/**
 * Check if an image might have a watermark based on source URL.
 * WeChat CDN images often have watermarks.
 */
export function isWatermarkedSource(url: string): boolean {
  return /mmbiz\.qpic\.cn/i.test(url);
}
