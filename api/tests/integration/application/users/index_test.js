const { expect, sinon, HttpTestServer } = require('../../../test-helper');

const securityController = require('../../../../lib/interfaces/controllers/security-controller');
const userController = require('../../../../lib/application/users/user-controller');
const moduleUnderTest = require('../../../../lib/application/users');

describe('Integration | Application | Users | Routes', () => {

  let httpTestServer;

  beforeEach(() => {
    sinon.stub(securityController, 'checkUserHasRolePixMaster').callsFake((request, h) => h.response(true));
    sinon.stub(userController, 'updateUserPersonalInformation').returns('ok');
    httpTestServer = new HttpTestServer(moduleUnderTest);
  });

  describe('PATCH /api/users/{id}', () => {

    it('should exist', async () => {
      // given
      const method = 'PATCH';
      const url = '/api/users/123';
      const payload = {
        data: {
          type: 'users',
          id: '123',
          attributes: {
            'first-name': 'edited-first_name',
            'last-name': 'edited-last_name',
            'email': 'edited-email',
            'username': 'edited-username',
          },
        }
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
