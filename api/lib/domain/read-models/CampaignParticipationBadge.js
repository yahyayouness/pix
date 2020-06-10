class CampaignParticipationBadge {

  constructor({
    id,
    // attributes
    key,
    altMessage,
    imageUrl,
    message,
    isAcquired,
    // includes
    badgeCriteria = [],
    badgePartnerCompetences = [],
    partnerCompetenceResults = [],
    // references
    targetProfileId,
  } = {}) {
    this.id = id;
    // attributes
    this.altMessage = altMessage;
    this.imageUrl = imageUrl;
    this.message = message;
    this.key = key;
    this.isAcquired = isAcquired;
    // includes
    this.badgeCriteria = badgeCriteria;
    this.badgePartnerCompetences = badgePartnerCompetences;
    this.partnerCompetenceResults = partnerCompetenceResults;
    // references
    this.targetProfileId = targetProfileId;
  }

  static buildFrom({ badge, partnerCompetenceResults, isAcquired }) {
    return new CampaignParticipationBadge({
      ...badge,
      partnerCompetenceResults,
      isAcquired
    });
  }
}

module.exports = CampaignParticipationBadge;
