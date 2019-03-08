const { expect, sinon } = require('../../../test-helper');
const Hapi = require('hapi');
const profileV2Controller = require('../../../../lib/application/profileV2/profileV2-controller');

describe('Unit | Router | profileV2-router', () => {

  let server;

  beforeEach(() => {
    sinon.stub(profileV2Controller, 'get').callsFake((request, h) => h.response().code(200));

    server = Hapi.server();
    return server.register(require('../../../../lib/application/profileV2'));
  });

  afterEach(() => {
    server.stop();
  });

  describe('GET /api/profileV2/{id}', function() {

    it('should exist', () => {
      // given
      const options = {
        method: 'GET',
        url: '/api/profileV2/1'
      };

      // when
      const promise = server.inject(options);

      // then
      return promise.then((res) => {
        expect(res.statusCode).to.equal(200);
      });
    });
  });
});
