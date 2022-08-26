import Twit from "twit";
import fetch from "node-fetch";

import { Post, Config } from "./types";
import { logger } from "./logger";
import { getPosts } from "./database";
import { getSource, rescaleImage } from "./utils";

let twitter: Twit;

/**
 * Create a Twit instance
 */
export function prepareTwitter(config: Config): void {
  twitter = new Twit(config.twitter);
}

/**
 * Post an image from the database to Twitter
 */
export async function postImages(config: Config): Promise<void> {
  const posts: Post[] = await getPosts();
  if (posts.length === 0) return;

  const post = posts.pop();
  
  const source = await getSource(
    config,
    post.image
  );

  if (source) {
    post.source = source;
    await post.save();
  }

  const res = await fetch(post.image, {});
  const buffer = await res.arrayBuffer();
  const scaled = await rescaleImage(Buffer.from(buffer));

  logger.info(`Uploading ${post.postID}`);

  const media = await new Promise((resolve, reject) => {
    twitter.post(
      'media/upload',
      {
        media_data: scaled.toString('base64')
      },
      (err, data, response) => {
        if (err) {
          resolve(null);
          return;
        }

        resolve(data.media_id_string);
      }
    );
  });

  if (media === null) {
    logger.error(`Error when uploading ${post.id}`);
    return;
  }

  const [username, tweet] = await new Promise((resolve, reject) => {
    twitter.post(
      'statuses/update',
      {
        status: post.postTitle,
        media_ids: [media]
      },
      async (err, data, response) => {
        if (err) {
          resolve(null);
          return;
        }

        logger.info(`Uploaded ${post.postID}`);
        resolve([data.user.screen_name, data.id_str]);
      }
    )
  });

  let reply = `@${username} Original post: https://reddit.com${post.postURL}`;
  if (source) {
    reply += `\nSource: ${source}`;
  }

  twitter.post(
    'statuses/update',
    {
      status: reply,
      in_reply_to_status_id: tweet
    },
    async (err, data, response) => {
      if (err) {
        logger.error(`Error when replying to ${tweet}.`);
        return;
      }

      logger.info(`Replied to ${tweet}`);
      post.posted = true;
      await post.save();
    }
  );
}