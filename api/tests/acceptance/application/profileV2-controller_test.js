const createServer = require('../../../server');
const { expect, knex, generateValidRequestAuhorizationHeader, nock, databaseBuilder } = require('../../test-helper');

describe('Acceptance | API | ProfileV2', () => {

  let server;

  beforeEach(async () => {
    server = await createServer();
  });

  describe('GET /api/profileV2/{id}', () => {

    let profileV2;
    let knowledgeElements;

    beforeEach(async () => {
      const id = 1;
      knowledgeElements = databaseBuilder.factory.buildSmartPlacementKnowledgeElement({ id });
      await databaseBuilder.commit();
    });

    afterEach(() => {
      return databaseBuilder.clean();
    });
    context('without authorization token', () => {

      it('should return 401 HTTP status code', () => {
        // given
        const smartPlacementProgressionId = assessmentId;
        const options = {
          method: 'GET',
          url: `/api/smart-placement-progressions/${smartPlacementProgressionId}`,
          headers: {
            authorization: 'invalid.access.token'
          }
        };

        // when
        const promise = server.inject(options);

        // then
        return promise.then((response) => {
          expect(response.statusCode).to.equal(401);
        });
      });
    });

    context('with authorization token', () => {

      context('when the assessment does not exists', () => {
        it('should respond with a 404', () => {
          // given
          const userIdOfUserWithoutAssessment = 8888;
          const smartPlacementProgressionId = -1;
          const options = {
            method: 'GET',
            url: `/api/smart-placement-progressions/${smartPlacementProgressionId}`,
            headers: {
              authorization: generateValidRequestAuhorizationHeader(userIdOfUserWithoutAssessment)
            }
          };

          // when
          const promise = server.inject(options);

          // then
          return promise.then((response) => {
            expect(response.statusCode).to.equal(404);
          });
        });
      });

      context('unallowed to access the smartPlacementProgression', () => {

        it('should respond with a 403 - forbidden access', () => {
          // given
          const userIdOfUserWithoutAssessment = 8888;
          const smartPlacementProgressionId = assessmentId;
          const options = {
            method: 'GET',
            url: `/api/smart-placement-progressions/${smartPlacementProgressionId}`,
            headers: {
              authorization: generateValidRequestAuhorizationHeader(userIdOfUserWithoutAssessment)
            }
          };

          // when
          const promise = server.inject(options);

          // then
          return promise.then((response) => {
            expect(response.statusCode).to.equal(403);
          });
        });
      });

      context('allowed to access the smartPlacementProgression', () => {

        it('should respond with a 200', () => {
          // given
          const smartPlacementProgressionId = assessmentId;
          const options = {
            method: 'GET',
            url: `/api/smart-placement-progressions/${smartPlacementProgressionId}`,
            headers: {
              authorization: generateValidRequestAuhorizationHeader(userIdOfUserWithAssessment)
            }
          };

          // when
          const promise = server.inject(options);

          // then
          return promise.then((response) => {
            expect(response.statusCode).to.equal(200);
          });
        });
      });
    });
  });

});
