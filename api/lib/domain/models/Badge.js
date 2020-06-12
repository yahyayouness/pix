const _ = require('lodash');
const BadgeCriterion = require('../models/BadgeCriterion');

class Badge {
  constructor({
    id,
    // attributes
    key,
    altMessage,
    imageUrl,
    message,
    // includes
    badgeCriteria = [],
    badgePartnerCompetences = [],
    // references
    targetProfileId,
  } = {}) {
    this.id = id;
    // attributes
    this.altMessage = altMessage;
    this.imageUrl = imageUrl;
    this.message = message;
    this.key = key;
    // includes
    this.badgeCriteria = badgeCriteria;
    this.badgePartnerCompetences = badgePartnerCompetences;
    // references
    this.targetProfileId = targetProfileId;
  }

  isAcquired({ campaignParticipationResult }) {
    return _.every(this.badgeCriteria, (criterion) => {
      let isBadgeCriterionFulfilled = false;
      let campaignParticipationBadge;

      switch (criterion.scope) {
        case BadgeCriterion.SCOPES.CAMPAIGN_PARTICIPATION :
          isBadgeCriterionFulfilled = this._verifyCampaignParticipationResultMasteryPercentageCriterion(
            campaignParticipationResult,
            criterion.threshold
          );
          break;
        case BadgeCriterion.SCOPES.EVERY_PARTNER_COMPETENCE :
          campaignParticipationBadge = _.find(
            campaignParticipationResult.campaignParticipationBadges,
            (campaignParticipationBadge) => campaignParticipationBadge.id === this.id
          );
          if (campaignParticipationBadge) {
            isBadgeCriterionFulfilled = this._verifyEveryPartnerCompetenceResultMasteryPercentageCriterion(
              campaignParticipationBadge.partnerCompetenceResults,
              criterion.threshold
            );
          }
          break;
        default:
          isBadgeCriterionFulfilled = false;
          break;
      }

      return isBadgeCriterionFulfilled;
    });
  }

  _verifyCampaignParticipationResultMasteryPercentageCriterion(campaignParticipationResult, threshold) {
    return campaignParticipationResult.masteryPercentage >= threshold;
  }

  _verifyEveryPartnerCompetenceResultMasteryPercentageCriterion(partnerCompetenceResults, threshold) {
    return _.every(partnerCompetenceResults, (partnerCompetenceResult) =>
      partnerCompetenceResult.masteryPercentage >= threshold);
  }
}

Badge.keys = {
  PIX_EMPLOI_CLEA: 'PIX_EMPLOI_CLEA',
};

module.exports = Badge;
