import sharp from "sharp";
import fetch from "node-fetch";

import { Config } from "./types";
import { logger } from "./logger";

/**
 * Get the source of an image via SauceNAO
 * https://saucenao.com/
 */
export async function getSource(
  config: Config,
  imageUrl: string
): Promise<string | null> {
  if (config.saucenow === "") {
    return null;
  }

  try {
    const res = await fetch(
      `https://saucenao.com/search.php?db=999&output_type=2&numres=1&api_key=${config.saucenow}&url=${imageUrl}`,
      {}
    );

    const json = await res.json() as Record<string, any>;
    return json.results[0].data.ext_urls[0];
  } catch(e) {
    logger.error(`Error when fetching source for ${imageUrl}`);
    return null;
  }
}

/**
 * Resize an image till it fits under Twitter's size limit
 */
const TWITTER_SIZE_LIMIT = 5 * 100 * 1024;

export async function rescaleImage(image: Buffer): Promise<Buffer> {
  const size = image.byteLength;

  if (size > TWITTER_SIZE_LIMIT) {
    const img = sharp(image);
    const metadata = await img.metadata();

    image = await img
      .resize({
        width: Math.round(metadata.width * 0.75),
        height: Math.round(metadata.height * 0.75)
      })
      .toBuffer();

    return rescaleImage(image);
  }

  return image;
}