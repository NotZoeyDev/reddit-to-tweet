# RedditToTwitter

Script to mirror Reddit posts to a Twitter account.

## Building

Install the node modules using `npm install` and then build the script using `npm build`.

## Configuration

All configs goes inside a json file, you can use `config.example.json` as a template.

## Usage

Use `node index` after building to start the script, it'll use `config.json` by default for the configurations.

```shell
Options:
      --help      Show help                                            [boolean]
      --version   Show version number                                  [boolean]
  -w, --web       Enable the web server               [boolean] [default: false]
  -c, --config    Config file to use           [string] [default: "config.json"]
  -p, --port      Port for the web server               [number] [default: 9600]
  -d, --database  Name of the database               [string] [default: "posts"]
```
