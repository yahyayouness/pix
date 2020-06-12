const _ = require('lodash');
const AssessmentCompleted = require('../events/AssessmentCompleted');
const BadgeAcquisition = require('../models/BadgeAcquisition');
const { checkEventType } = require('./check-event-type');

const eventType = AssessmentCompleted;

const handleBadgeAcquisition = async function({
  domainTransaction,
  event,
  badgeAcquisitionRepository,
  badgeRepository,
  campaignParticipationResultRepository,
}) {
  checkEventType(event, eventType);

  if (completedAssessmentBelongsToACampaign(event)) {
    const badges = await fetchPossibleCampaignAssociatedBadges(event, badgeRepository);
    const campaignParticipationResult = await fetchCampaignParticipationResults(event, badges, campaignParticipationResultRepository);

    const badgesBeingAcquired = badges.filter((badge) => badge.isAcquired({ campaignParticipationResult }));
    const badgesAcquisitionToCreate = badgesBeingAcquired.map((badge) => {
      return new BadgeAcquisition({
        badgeId: badge.id,
        userId: event.userId
      });
    });

    if (!_.isEmpty(badgesAcquisitionToCreate)) {
      await badgeAcquisitionRepository.create(badgesAcquisitionToCreate, domainTransaction);
    }
  }
};

function completedAssessmentBelongsToACampaign(event) {
  return !!event.targetProfileId;
}

async function fetchPossibleCampaignAssociatedBadges(event, badgeRepository) {
  return await badgeRepository.findByTargetProfileId(event.targetProfileId);
}

async function fetchCampaignParticipationResults(event, campaignBadges, campaignParticipationResultRepository) {
  const acquiredBadges = [];
  return await campaignParticipationResultRepository.getByParticipationId(event.campaignParticipationId, campaignBadges, acquiredBadges);
}

handleBadgeAcquisition.eventType = eventType;
module.exports = handleBadgeAcquisition;
