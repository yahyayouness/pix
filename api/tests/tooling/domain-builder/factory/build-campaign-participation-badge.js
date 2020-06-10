const CampaignParticipationBadge = require('../../../../lib/domain/read-models/CampaignParticipationBadge');
const faker = require('faker');

module.exports = function buildCampaignParticipationBadge(
  {
    id = faker.random.number(),
    key,
    altMessage,
    imageUrl,
    message,
    isAcquired = false,
    badgeCriteria = [],
    badgePartnerCompetences = [],
    partnerCompetenceResults = [],
  } = {}) {

  return new CampaignParticipationBadge({
    id,
    key,
    altMessage,
    imageUrl,
    message,
    isAcquired,
    badgeCriteria,
    badgePartnerCompetences,
    partnerCompetenceResults,
  });
};
