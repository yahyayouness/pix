const { expect, sinon, HttpTestServer } = require('../../../test-helper');
const securityController = require('../../../../lib/interfaces/controllers/security-controller');
const organizationUserInformationsController = require('../../../../lib/application/organization-user-informations/organization-user-informations-controller');

const moduleUnderTest = require('../../../../lib/application/organization-user-informations');

describe('Unit | Router | organization-user-informations-router', () => {

  let httpTestServer;

  beforeEach(() => {
    sinon.stub(securityController, 'checkUserIsAuthenticated').returns(true);
    sinon.stub(organizationUserInformationsController, 'create').returns('ok');
    httpTestServer = new HttpTestServer(moduleUnderTest);
  });

  describe('POST /api/organization-user-informations', () => {

    let method;
    let url;
    let payload;

    beforeEach(() => {
      method = 'POST';
      url = '/api/organization-user-informations';
      payload = {
        data: {
          relationships: {
            organization: {
              data: {
                id: 1,
                type: 'organizations'
              }
            },
            user: {
              data: {
                id: 1,
                type: 'users'
              }
            }
          }
        }
      };
    });

    it('should exist', async () => {
      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(200);
    });

    describe('Payload schema validation', () => {

      it('should have a payload', async () => {
        // given
        payload = undefined;

        // when
        const result = await httpTestServer.request(method, url, payload);

        // then
        expect(result.statusCode).to.equal(400);
      });

      it('should have an organization id in relationship in payload', async () => {
        // given
        payload.data.relationships.organization.data.id = undefined;

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('should have a user id in relationship in payload', async () => {
        // given
        payload.data.relationships.user.data.id = undefined;

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });

  });

  describe('PATCH /api/organization-user-informations', () => {

    let method;
    let url;
    let payload;

    beforeEach(() => {
      method = 'PATCH';
      url = '/api/organization-user-informations';
      payload = {
        data: {
          relationships: {
            organization: {
              data: {
                id: 1,
                type: 'organizations'
              }
            },
            user: {
              data: {
                id: 1,
                type: 'users'
              }
            }
          }
        }
      };
    });

    it('should exist', async () => {
      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(200);
    });

    describe('Payload schema validation', () => {

      it('should have a payload', async () => {
        // given
        payload = undefined;

        // when
        const result = await httpTestServer.request(method, url, payload);

        // then
        expect(result.statusCode).to.equal(400);
      });

      it('should have an organization id in relationship in payload', async () => {
        // given
        payload.data.relationships.organization.data.id = undefined;

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('should have a user id in relationship in payload', async () => {
        // given
        payload.data.relationships.user.data.id = undefined;

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });

  });
});
