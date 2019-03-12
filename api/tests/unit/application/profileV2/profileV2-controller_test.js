const { expect, sinon, domainBuilder } = require('../../../test-helper');

const usecases = require('../../../../lib/domain/usecases');
const profileV2Controller = require('../../../../lib/application/profileV2/profileV2-controller');

describe('Unit | Controller | profileV2-controller', () => {
  const userId = 60;

  describe('#get', () => {
    let profileV2, knowledgeElements;

    const request = {
      auth: { credentials: { userId } },
    };

    beforeEach(() => {
      sinon.stub(usecases, 'getProfileV2');
      knowledgeElements = domainBuilder.buildSmartPlacementKnowledgeElement(userId);
      profileV2 = {
        knowledgeElements
      };
    });

    it('should return the Profile V2', async () => {
      // given
      const expectedProfileV2JsonApi = {
        data: {
          attributes: {
            'knowledge-elements': knowledgeElements,
          },
          type: 'profileV2s',
        },
      };
      usecases.getProfileV2.resolves(profileV2);

      // when
      const response = await profileV2Controller.get(request);

      // Then
      expect(usecases.getProfileV2).to.have.been.calledWith({
        userId,
      });

      expect(response).to.deep.equal(expectedProfileV2JsonApi);
    });
  });

});
