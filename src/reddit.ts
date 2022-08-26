import Snoowrap from "snoowrap";
import path from "path";

import { Config, Post } from "./types";
import { checkPost } from "./database";
import { logger } from "./logger";

let reddit: Snoowrap;

/**
 * Create a Snoowrap instance
 */
export function prepareReddit(config: Config): void {
  reddit = new Snoowrap(config.reddit);
}

/**
 * Fetch posts from a subreddit
 */
export async function fetchPosts(subreddit: string): Promise<void> {
  logger.info(`Fetching posts from ${subreddit}`);

  try {
    const submissions = await reddit.getSubreddit(subreddit).getNew();

    for (const submission of submissions) {
      if (submission.ups <= 50) continue;
      if (submission.is_video) continue;

      const extname = path.extname(submission.url);
      if (!['.gif', '.jpg', '.jpeg', '.png'].includes(extname)) continue;

      const exists = await checkPost(
        submission.id,
        submission.url
      );
      if (exists) continue;

      logger.info(`Adding ${submission.id} to the database`);
      await Post.create({
        postTitle: submission.title,
        postID: submission.id,
        postURL: submission.permalink,
        image: submission.url
      });
    }
  } catch(e) {
    logger.error(`Error fetching posts from ${subreddit}`);
  }
}