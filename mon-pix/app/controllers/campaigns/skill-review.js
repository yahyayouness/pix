import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({

  isLoading: false,
  resultSharingFailed: false,
  isAssessmentImprovable: false,

  pageTitle: 'Résultat',

  shouldShowPixEmploiBadge: computed(function() {
    const targetProfileName = this.get('model.campaignParticipation.campaign.targetProfile.name');
    const masteryPercentage = this.get('model.campaignParticipation.campaignParticipationResult.masteryPercentage');
    return (masteryPercentage >= 85 && targetProfileName === 'Pix emploi - Parcours complet');
  }),

  shouldShowCleaNumeriqueBadge: computed(function() {
    const targetProfileName = this.get('model.campaignParticipation.campaign.targetProfile.name');
    const masteryPercentage = this.get('model.campaignParticipation.campaignParticipationResult.masteryPercentage');
    return (masteryPercentage >= 85 && targetProfileName === 'Parcours Cléa numérique');
  }),

  actions: {
    shareCampaignParticipation() {
      this.set('resultSharingFailed', false);
      this.set('isLoading', true);
      const campaignParticipation = this.get('model.campaignParticipation');
      return campaignParticipation.save()
        .then(() => {
          campaignParticipation.set('isShared', true);
        })
        .catch(() => {
          campaignParticipation.rollbackAttributes();
          this.set('resultSharingFailed', true);
        })
        .finally(() => {
          this.set('isLoading', false);
        });
    },

    async improvementCampaignParticipation() {
      const assessment = this.get('model.assessment');
      const campaignParticipation = this.get('model.campaignParticipation');
      await campaignParticipation.save({ adapterOptions: { beginImprovement: true } });
      return this.transitionToRoute('campaigns.start-or-resume', assessment.get('codeCampaign'));
    },

  }
});
