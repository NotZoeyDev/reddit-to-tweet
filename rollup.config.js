import { defineConfig } from 'rollup';
import { swc } from 'rollup-plugin-swc3';

export default defineConfig({
  input: 'src/index.ts',
  treeshake: true,
  inlineDynamicImports: true,
  external: [
    "fs",
    "process",
    "path",

    "yargs/yargs",
    "yargs/helpers",
    "sharp",
    "twit",
    "snoowrap",
    "express",
    "cors",
    "node-fetch",
    "sequelize",
    "sequelize-typescript"
  ],
  output: [
    {
      file: 'index.js',
      format: 'cjs',
      strict: false,
    }
  ],
  plugins: [
    swc({
      jsc: {
        minify: {
          compress: true
        },
        parser: {
          'syntax': 'typescript',
        },
        target: 'es2022',
        baseUrl: './src/',
      }
    }),
  ]
});