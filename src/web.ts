import express from "express";
import cors from "cors";

import { Config } from "./types";
import { logger } from "./logger";
import { getPostsPaginated } from "./database";

/**
 * Create the web server
 */
export function createServer(config: Config) {
  const app = express();

  app.use(cors());

  app.get("/posts.json", async (req, res) => {
    let page = req.query.p ?? 1;
    if (page <= 0) page = 1;

    const posts = await getPostsPaginated(Number(page));

    res.json(
      posts.map(post => post.toJSON())
    );
  });

  app.listen(config.port, () => {
    logger.info(`Web server is available at http://localhost:${config.port}`);
  });
}