const { expect, sinon, HttpTestServer } = require('../../../test-helper');
const securityController = require('../../../../lib/interfaces/controllers/security-controller');
const userController = require('../../../../lib/application/users/user-controller');
const userVerification = require('../../../../lib/application/preHandlers/user-existence-verification');

const moduleUnderTest = require('../../../../lib/application/users');

describe('Unit | Router | user-router', () => {

  const userId = '12344';
  let auth;
  let httpTestServer;

  beforeEach(() => {
    auth = { credentials: { userId }, strategy: {} };

    sinon.stub(securityController, 'checkUserIsAuthenticated').returns(true);
    sinon.stub(securityController, 'checkUserHasRolePixMaster').returns(true);
    sinon.stub(securityController, 'checkRequestedUserIsAuthenticatedUser').callsFake((request, h) => h.response(true));

    sinon.stub(userController, 'findPaginatedFilteredUsers').returns('ok');
    sinon.stub(userController, 'save').returns('ok');
    sinon.stub(userController, 'getCertificationProfile').returns('ok');
    sinon.stub(userController, 'getCurrentUser').returns('ok');
    sinon.stub(userController, 'getMemberships').returns('ok');
    sinon.stub(userController, 'getOrganizationUserInformations').returns('ok');
    sinon.stub(userController, 'getPixScore').returns('ok');
    sinon.stub(userController, 'getScorecards').returns('ok');
    sinon.stub(userController, 'updateCurrentOrganization').callsFake((request, h) => h.response().code(204));

    sinon.stub(userController, 'updatePassword').returns('ok');

    sinon.stub(userVerification, 'verifyById').returns('ok');

    httpTestServer = new HttpTestServer(moduleUnderTest);
  });

  describe('GET /api/users', () => {

    it('should exist', async () => {
      // given
      const method = 'GET';
      const url = '/api/users?firstName=Bruce&lastName=Wayne&email=batman@gotham.city&page=3&pageSize=25';

      // when
      const response = await httpTestServer.request(method, url, null, auth);

      // then
      expect(response.statusCode).to.equal(200);

    });
  });

  describe('POST /api/users', () => {

    it('should exist', async () => {
      // given
      const method = 'POST';
      const url = '/api/users';
      const payload = {
        data: {
          attributes: {
            'first-name': 'Edouard',
            'last-name': 'Doux',
            email: 'doux.doudou@example.net',
            password: 'password_1234',
          },
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  describe('GET /api/users/me', function() {

    it('should exist', async () => {
      // given
      const method = 'GET';
      const url = '/api/users/me';

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  describe('GET /api/users/{id}/memberships', function() {

    it('should exist', async () => {
      // given
      const method = 'GET';
      const url = '/api/users/12/memberships';

      // when
      await httpTestServer.request(method, url);

      // then
      sinon.assert.calledOnce(userController.getMemberships);
    });
  });

  describe('PATCH /api/users/{id}/password-update', function() {

    const url = '/api/users/12344/password-update';
    const method = 'PATCH';
    let payload;

    beforeEach(() => {
      payload = { data: { attributes: { password: '' } } };
    });

    it('should exist and pass through user verification pre-handler', async () => {
      // given
      payload.data.attributes.password = 'Pix2019!';

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(200);
      sinon.assert.calledOnce(userVerification.verifyById);
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

      it('should have a password attribute in payload', async () => {
        // given
        payload.data.attributes = {};

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(400);
      });

      describe('password validation', () => {

        it('should have a valid password format in payload', async () => {
          // given
          payload.data.attributes.password = 'Mot de passe mal formé';

          // when
          const response = await httpTestServer.request(method, url, payload);

          // then
          expect(response.statusCode).to.equal(400);
        });
      });
    });
  });

  describe('GET /api/users/{id}/certification-profile', function() {

    it('should exist', async () => {
      // given
      const method = 'GET';
      const url = '/api/users/42/certification-profile';

      // when
      await httpTestServer.request(method, url);

      // then
      sinon.assert.calledOnce(userController.getCertificationProfile);
    });
  });

  describe('GET /api/users/{id}/pixscore', function() {

    it('should exist', async () => {
      // given
      const method = 'GET';
      const url = '/api/users/42/pixscore';

      // when
      await httpTestServer.request(method, url);

      // then
      sinon.assert.calledOnce(userController.getPixScore);
    });
  });

  describe('GET /api/users/{id}/scorecards', function() {

    it('should exist', async () => {
      // given
      const method = 'GET';
      const url = '/api/users/42/scorecards';

      // when
      await httpTestServer.request(method, url);

      // then
      sinon.assert.calledOnce(userController.getScorecards);
    });
  });

  describe('GET /api/users/{id}/organization-user-informations', function() {

    it('should exist', async () => {
      // given
      const method = 'GET';
      const url = '/api/users/12/organization-user-informations';

      // when
      await httpTestServer.request(method, url);

      // then
      sinon.assert.calledOnce(userController.getOrganizationUserInformations);
    });
  });

  describe('PUT /api/users/{id}/update-current-organization', function() {

    const method = 'PUT';
    const url = `/api/users/${userId}/update-current-organization`;
    let payload;

    beforeEach(() => {
      payload = {
        data: {
          relationships: {
            organization: {
              data: {
                id: 1,
                type: 'organizations'
              }
            }
          }
        }
      };
    });

    it('should exist and pass through authenticated check', async () => {
      // when
      const response = await httpTestServer.request(method, url, payload, auth);

      // then
      expect(response.statusCode).to.equal(204);
    });

    describe('Payload schema validation', () => {

      it('should have an id', async () => {
        // given
        payload.data.relationships.organization.data.id = undefined;

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('should reject when id is not integer', async () => {
        // given
        payload.data.relationships.organization.data.id = 'test';

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });
});
