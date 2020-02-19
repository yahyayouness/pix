const { expect, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../test-helper');
const createServer = require('../../../server');

describe('Acceptance | Controller | organization-user-informations-controller', () => {

  let userId;
  let options;
  let server;

  beforeEach(async () => {
    server = await createServer();
  });

  describe('PATCH /api/organization-user-informations', () => {

    let newOrganizationId;

    beforeEach(async () => {
      userId = databaseBuilder.factory.buildUser().id;
      newOrganizationId = databaseBuilder.factory.buildOrganization().id;
      databaseBuilder.factory.buildOrganizationUserInformations({ userId });
      await databaseBuilder.commit();

      options = {
        method: 'PATCH',
        url: '/api/organization-user-informations',
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        payload: {
          data: {
            relationships: {
              organization: {
                data: {
                  id: newOrganizationId,
                  type: 'organizations'
                }
              },
              user: {
                data: {
                  id: userId,
                  type: 'users'
                }
              }
            }
          }
        }
      };
    });

    describe('Resource access management', () => {

      it('should respond with a 401 - unauthorized access - if user is not authenticated', async () => {
        // given
        options.headers.authorization = 'invalid.access.token';

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });

      it('should respond with a 400 if payload user is not the same as authenticated user', async () => {
        // given
        const otherUserId = 9999;
        options.headers.authorization = generateValidRequestAuthorizationHeader(otherUserId);

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });

    describe('Success case', () => {

      it('should update and return 204 HTTP status code', async () => {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(204);
      });
    });

    describe('Error case', () => {

      it('should respond with a 400 HTTP status code - if there is no organization id ', async () => {
        // given
        options.payload.data.relationships.organization.data = {
          id: undefined
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('should respond with a 400 HTTP status code - if organization id is not a number', async () => {
        // given
        options.payload.data.relationships.organization.data = {
          id: 'test'
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });
});
