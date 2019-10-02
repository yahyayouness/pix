const cache = require('../../infrastructure/caches/cache');
const preloader = require('../../infrastructure/caches/preloader');
const logger = require('../../infrastructure/logger');
const usecases = require('../../domain/usecases');
const { PassThrough } = require('stream');

async function _writeProgressUntilResolved(stream, promise) {
  const timer = setInterval(() => {
    stream.write('\n');
  }, 1000);

  try {
    await promise;
    stream.write('{"success":true}\n');
  } catch (err) {
    logger.error(err);
    stream.write('{"success":false}\n');
  } finally {
    //clearInterval(timer);
    stream.end();
  }
}

function _createProgressStream(promise) {
  const stream = new PassThrough();
  stream.headers = {
    'content-type': 'application/json',
    'content-encoding': 'identity'
  };

  _writeProgressUntilResolved(stream, promise);

  return stream;
}

module.exports = {

  reloadCacheEntry(request) {
    const cacheKey = request.params.cachekey || '';
    const [ tableName, recordId ] = cacheKey.split('_');
    return usecases.reloadCacheEntry({ preloader, tableName, recordId })
      .then(() => null);
  },

  removeAllCacheEntries() {
    return usecases.removeAllCacheEntries({ cache })
      .then(() => null);
  },

  preloadCacheEntries() {
    return _createProgressStream(usecases.preloadCacheEntries({ preloader, logger }));
  }
};
