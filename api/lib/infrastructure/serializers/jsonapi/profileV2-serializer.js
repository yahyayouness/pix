const { Serializer } = require('jsonapi-serializer');

module.exports = {

  serialize(profileV2) {
    return new Serializer('profileV2', {
      attributes: ['knowledgeElements'],
    }).serialize(profileV2);
  }
};
