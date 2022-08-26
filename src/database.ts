import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';

import { Config, Post } from './types';

let sequelize: Sequelize;

/**
 * Prepare the SQLite database
 */
export async function prepareDatabase(config: Config): Promise<void> {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: `${config.database}.sqlite`,
    models: [Post],
    logging: false
  });

  await sequelize.authenticate();
  await Post.sync();
}

/**
 * Check if a post is already in the database
 */
export async function checkPost(
  id: string,
  image: string
): Promise<boolean> {
  const post = await Post.findOne({
    where: {
      [Op.or]: [
        { postID: id },
        { image: image }
      ]
    }
  });

  return post !== null;
}

/**
 * Get non posted posts
 */
export async function getPosts(): Promise<Post[]> {
  const posts = await Post.findAll({
    where: {
      posted: false
    }
  });

  return posts;
}

/**
 * Get posts with pagination
 */
export async function getPostsPaginated(page = 1): Promise<Post[]> {
  const posts = await Post.findAll({
    limit: 10,
    offset: (page - 1) * 10,
    order: [
      ['id', 'DESC']
    ]
  });

  return posts;
}

/**
 * Close the SQLite connection
 */
export async function close(): Promise<void> {
  await sequelize.close();
} 