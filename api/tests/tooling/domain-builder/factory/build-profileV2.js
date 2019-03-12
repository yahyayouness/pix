const ProfileV2 = require('../../../../lib/domain/models/ProfileV2');
const buildSmartPlacementKnowledgeElement = require('./build-smart-placement-knowledge-element');

module.exports = function buildProfileV2({
  knowledgeElements = buildSmartPlacementKnowledgeElement(),
} = {}) {
  return new ProfileV2({
    knowledgeElements
  });
};
