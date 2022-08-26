import { Table, Model, AutoIncrement, PrimaryKey, Column, DataType, Default } from "sequelize-typescript";

@Table({
  tableName: "Posts"
})
export class Post extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.TEXT)
  postTitle: string;

  @Column(DataType.TEXT)
  postID: string;

  @Column(DataType.TEXT)
  postURL: string;

  @Column(DataType.TEXT)
  image: string;

  @Default("")
  @Column(DataType.TEXT)
  source: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  posted: boolean;
}

export interface Config {
  web: boolean;
  port: number;
  database: string;
  subreddits: string[];
  saucenow: string;
  twitter: {
    consumer_key: string;
    consumer_secret: string;
    access_token: string;
    access_token_secret: string;
  },
  reddit: {
    userAgent: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  },
}