Slack logging bot & history viewer.

Partly inspired by [Slack patron](https://github.com/tyage/slack-patron). Created using [Meteor](https://github.com/meteor/meteor).

## Running:

### Development mode
- [Install Meteor](https://www.meteor.com/install)
- clone repository & `cd` into created directory
- `cp settings.example.json settings.json`, edit it
- run `meteor --settings settings.json`
  - optionally add `--production` to minify assets…
  - …or `--port 1234` to run on custom port (default is 3000)

### Production mode
- `cd` into slack-logger directory
- `meteor build /some/path`
- copy `/some/path/bundle/slack-logger.tar.xz` to your production server, unpack it and follow `README` there
