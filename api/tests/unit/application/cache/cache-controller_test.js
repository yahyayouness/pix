const { expect, sinon, streamToPromise } = require('../../../test-helper');
const usecases = require('../../../../lib/domain/usecases');
const cache = require('../../../../lib/infrastructure/caches/cache');
const preloader = require('../../../../lib/infrastructure/caches/preloader');
const logger = require('../../../../lib/infrastructure/logger');
const cacheController = require('../../../../lib/application/cache/cache-controller');

describe('Unit | Controller | cache-controller', () => {

  describe('#reloadCacheEntry', () => {

    const request = {
      params: {
        cachekey: 'Epreuves_recABCDEF'
      }
    };

    beforeEach(() => {
      sinon.stub(usecases, 'reloadCacheEntry');
    });

    it('should reply with null when the cache key exists', async () => {
      // given
      const numberOfDeletedKeys = 1;
      usecases.reloadCacheEntry.resolves(numberOfDeletedKeys);

      // when
      const response = await cacheController.reloadCacheEntry(request);

      // then
      expect(usecases.reloadCacheEntry).to.have.been.calledWith({
        preloader,
        tableName: 'Epreuves',
        recordId: 'recABCDEF'
      });
      expect(response).to.be.null;
    });

    it('should reply with null when the cache key does not exist', async () => {
      // given
      const numberOfDeletedKeys = 0;
      usecases.reloadCacheEntry.resolves(numberOfDeletedKeys);

      // when
      const response = await cacheController.reloadCacheEntry(request);

      // Then
      expect(response).to.be.null;
    });

    it('should allow a table name without a record id', async () => {
      // given
      const numberOfDeletedKeys = 1;
      usecases.reloadCacheEntry.resolves(numberOfDeletedKeys);

      // when
      const response = await cacheController.reloadCacheEntry({ params: { cachekey: 'Epreuves' } });

      // Then
      expect(usecases.reloadCacheEntry).to.have.been.calledWith({
        preloader,
        tableName: 'Epreuves',
        recordId: undefined
      });
      expect(response).to.be.null;
    });
  });

  describe('#removeAllCacheEntries', () => {
    const request = {};

    beforeEach(() => {
      sinon.stub(usecases, 'removeAllCacheEntries');
    });

    it('should reply with null when there is no error', async () => {
      // given
      usecases.removeAllCacheEntries.resolves();

      // when
      const response = await cacheController.removeAllCacheEntries(request);

      // Then
      expect(usecases.removeAllCacheEntries).to.have.been.calledWith({ cache });
      expect(response).to.be.null;
    });
  });

  describe('#preloadCacheEntries', () => {
    let clock;

    beforeEach(() => {
      sinon.stub(usecases, 'preloadCacheEntries');
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should reply with JSON in a stream when there is no error', async () => {
      // given
      let resolveReloadPromise;
      const reloadPromise = new Promise((resolve) => resolveReloadPromise = resolve);
      usecases.preloadCacheEntries.returns(reloadPromise);

      // when
      const responseStream = cacheController.preloadCacheEntries();

      // record response stream
      const responsePromise = streamToPromise(responseStream);

      let responseStreamWritten = false;
      responseStream.on('data', () => {
        responseStreamWritten = true;
      });

      // when: time passes
      clock.tick(5000);

      // then: something must have been written to the stream, to keep the connection alive
      expect(responseStreamWritten).to.be.true;

      // when: reloading is complete
      resolveReloadPromise();

      // wait for response stream to end
      const response = await responsePromise;

      // then
      expect(usecases.preloadCacheEntries).to.have.been.calledWith({ preloader, logger });
      expect(JSON.parse(response)).to.deep.equal({ success: true });
    });

    it('should reply with JSON in a stream when there is an error', async () => {
      // given
      usecases.preloadCacheEntries.rejects();

      // when
      const response = await streamToPromise(cacheController.preloadCacheEntries());

      // Then
      expect(JSON.parse(response)).to.deep.equal({ success: false });
    });
  });
});
