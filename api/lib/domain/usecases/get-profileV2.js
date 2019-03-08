const ProfileV2 = require('../models/ProfileV2');

module.exports = async function getProfileV2(
  {
    userId,
    smartPlacementKnowledgeElementRepository
  }) {

  const knowledgeElements = await smartPlacementKnowledgeElementRepository.findUniqByUserId(userId);

  return new ProfileV2({
    knowledgeElements,
  });

};
