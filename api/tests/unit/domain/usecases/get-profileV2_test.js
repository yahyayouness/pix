const { expect, sinon, domainBuilder } = require('../../../test-helper');
const getProfileV2 = require('../../../../lib/domain/usecases/get-profileV2');

describe('Unit | UseCase | get-profileV2', () => {

  let knowledgeElements;
  let smartPlacementKnowledgeElementRepository;

  beforeEach(() => {
    knowledgeElements = domainBuilder.buildSmartPlacementKnowledgeElement();
    smartPlacementKnowledgeElementRepository = {
      findUniqByUserId() {}
    };
  });

  context('User has at least one knowledge element', () => {
    it('should get the Profile V2', () => {
      // given
      const userId = 1;
      const expectedResult = {
        knowledgeElements
      };

      sinon.stub(smartPlacementKnowledgeElementRepository, 'findUniqByUserId').resolves(knowledgeElements);

      // when
      const promise = getProfileV2({ userId, smartPlacementKnowledgeElementRepository });

      // then
      return promise.then((result) => {
        expect(result).to.be.deep.equal(expectedResult);
      });

    });
  });

  context('User does not have knowledge element', () => {
    it('should get the Profile V2', () => {
      // given
      const userId = 1;
      const expectedResult = {
        knowledgeElements: []
      };

      sinon.stub(smartPlacementKnowledgeElementRepository, 'findUniqByUserId').resolves([]);

      // when
      const promise = getProfileV2({ userId, smartPlacementKnowledgeElementRepository });

      // then
      return promise.then((result) => {
        expect(result).to.be.deep.equal(expectedResult);
      });

    });
  });

});
