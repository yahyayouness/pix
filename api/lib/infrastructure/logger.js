const bunyan = require('bunyan');
const settings = require('../settings');

const logger = bunyan.createLogger({ name: 'pix-api', streams: [] });

if (settings.logging.enabled) {

  logger.addStream({
    name: 'standard-output',
    stream: process.stdout,
    level: 'debug'
  });
}

module.exports = logger;
