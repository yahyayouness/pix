const { expect, domainBuilder } = require('../../../../test-helper');
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/profileV2-serializer');

describe('Unit | Serializer | JSONAPI | profileV2-serializer', function() {

  describe('#serialize()', function() {

    it('should convert a ProfileV2 model object into JSON API data', function() {
      const profileV2 = domainBuilder.buildProfileV2();

      // when
      const json = serializer.serialize(profileV2);

      // then
      expect(json).to.deep.equal({
        'data': {
          'type': 'profileV2s',
          'attributes': {
            'knowledge-elements': profileV2.knowledgeElements,
          },
        },
      });
    });
  });
});
