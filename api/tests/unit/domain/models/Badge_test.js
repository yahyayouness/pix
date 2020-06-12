const { domainBuilder, expect } = require('../../../test-helper');

const BadgeCriterion = require('../../../../lib/domain/models/BadgeCriterion');

const CRITERION_THRESHOLD = {
  CAMPAIGN_PARTICIPATION: 85,
  EVERY_PARTNER_COMPETENCE: 75
};

describe('Unit | Domain | Models | badge', () => {

  describe('#isAcquired', () => {

    context('when badge contains only one criterion', function() {

      context('CAMPAIGN_PARTICIPATION criterion', function() {

        let badge;

        beforeEach(function() {
          const badgeCriteria = [domainBuilder.buildBadgeCriterion({
            id: 1,
            scope: BadgeCriterion.SCOPES.CAMPAIGN_PARTICIPATION,
            threshold: CRITERION_THRESHOLD.CAMPAIGN_PARTICIPATION
          })];
          badge = domainBuilder.buildBadge({ id: 33, badgeCriteria });
        });

        it('should return true when criterion is fulfilled', async function() {
          // given
          const campaignParticipationBadge = domainBuilder.buildCampaignParticipationBadge({
            id: badge.id,
            isAcquired: true,
            partnerCompetenceResults: []
          });
          const campaignParticipationResult = domainBuilder.buildCampaignParticipationResult({
            badge,
            campaignParticipationBadges: [campaignParticipationBadge],
            validatedSkillsCount: 9,
            totalSkillsCount: 10,
          });
          badge.partnerCompetenceResults = [];

          // when
          const result = await badge.isAcquired({ campaignParticipationResult });

          // then
          expect(result).to.be.equal(true);
        });

        it('should return false when criterion is not fulfilled', async function() {
          // given
          const campaignParticipationBadge = domainBuilder.buildCampaignParticipationBadge({
            id: badge.id,
            isAcquired: true,
            partnerCompetenceResults: []
          });
          const campaignParticipationResult = domainBuilder.buildCampaignParticipationResult({
            badge,
            campaignParticipationBadges: [campaignParticipationBadge],
            validatedSkillsCount: 1,
            totalSkillsCount: 10,
          });
          badge.partnerCompetenceResults = [];

          // when
          const result = await badge.isAcquired({ campaignParticipationResult });

          // then
          expect(result).to.be.equal(false);
        });
      });

      context('EVERY_PARTNER_COMPETENCE criterion', function() {

        let badge;

        beforeEach(function() {
          const badgeCriteria = [domainBuilder.buildBadgeCriterion({
            id: 1,
            scope: BadgeCriterion.SCOPES.EVERY_PARTNER_COMPETENCE,
            threshold: CRITERION_THRESHOLD.EVERY_PARTNER_COMPETENCE
          })];
          badge = domainBuilder.buildBadge({ id: 33, badgeCriteria });
        });

        it('should return true when criterion is fulfilled', async function() {
          // given
          const partnerCompetenceResults = [
            domainBuilder.buildCompetenceResult({
              id: 1,
              validatedSkillsCount: 9,
              totalSkillsCount: 10,
              badgeId: badge.id,
            }),
            domainBuilder.buildCompetenceResult({
              id: 2,
              validatedSkillsCount: 9,
              totalSkillsCount: 10,
              badgeId: badge.id,
            }),
          ];
          const campaignParticipationBadge = domainBuilder.buildCampaignParticipationBadge({
            id: badge.id,
            isAcquired: true,
            partnerCompetenceResults: partnerCompetenceResults
          });
          const campaignParticipationResult = domainBuilder.buildCampaignParticipationResult({
            badge,
            campaignParticipationBadges: [campaignParticipationBadge],
            validatedSkillsCount: 9,
            totalSkillsCount: 10,
          });
          badge.partnerCompetenceResults = partnerCompetenceResults;

          // when
          const result = await badge.isAcquired({ campaignParticipationResult });

          // then
          expect(result).to.be.equal(true);
        });

        it('should return false when criterion is not fulfilled', async function() {
          // given
          const partnerCompetenceResults = [
            domainBuilder.buildCompetenceResult({
              id: 1,
              validatedSkillsCount: 1,
              totalSkillsCount: 10,
              badgeId: badge.id,
            }),
            domainBuilder.buildCompetenceResult({
              id: 2,
              validatedSkillsCount: 3,
              totalSkillsCount: 10,
              badgeId: badge.id,
            }),
          ];
          const campaignParticipationBadge = domainBuilder.buildCampaignParticipationBadge({
            id: badge.id,
            isAcquired: true,
            partnerCompetenceResults: partnerCompetenceResults
          });
          const campaignParticipationResult = domainBuilder.buildCampaignParticipationResult({
            badge,
            campaignParticipationBadges: [campaignParticipationBadge],
            validatedSkillsCount: 2,
            totalSkillsCount: 10,
          });
          badge.partnerCompetenceResults = partnerCompetenceResults;

          // when
          const result = await badge.isAcquired({ campaignParticipationResult });

          // then
          expect(result).to.be.equal(false);
        });
      });

    });

    context('when badge contains two criteria', function() {

      let badge;

      beforeEach(function() {
        const badgeCriteria = [
          domainBuilder.buildBadgeCriterion({
            id: 1,
            scope: BadgeCriterion.SCOPES.CAMPAIGN_PARTICIPATION,
            threshold: CRITERION_THRESHOLD.CAMPAIGN_PARTICIPATION
          }),
          domainBuilder.buildBadgeCriterion({
            id: 2,
            scope: BadgeCriterion.SCOPES.EVERY_PARTNER_COMPETENCE,
            threshold: CRITERION_THRESHOLD.EVERY_PARTNER_COMPETENCE
          }),
        ];
        badge = domainBuilder.buildBadge({ id: 33, badgeCriteria });
      });

      it('should return true when both badge criteria are fulfilled', async () => {
        // given
        const partnerCompetenceResults = [
          domainBuilder.buildCompetenceResult({
            id: 1,
            validatedSkillsCount: 9,
            totalSkillsCount: 10,
            badgeId: badge.id,
          }),
          domainBuilder.buildCompetenceResult({
            id: 2,
            validatedSkillsCount: 9,
            totalSkillsCount: 10,
            badgeId: badge.id,
          }),
        ];
        const campaignParticipationBadge = domainBuilder.buildCampaignParticipationBadge({
          id: badge.id,
          isAcquired: true,
          partnerCompetenceResults: partnerCompetenceResults
        });
        const campaignParticipationResult = domainBuilder.buildCampaignParticipationResult({
          badge,
          campaignParticipationBadges: [campaignParticipationBadge],
          validatedSkillsCount: 9,
          totalSkillsCount: 10,
        });
        badge.partnerCompetenceResults = partnerCompetenceResults;

        // when
        const result = await badge.isAcquired({ campaignParticipationResult });

        // then
        expect(result).to.be.equal(true);
      });

      it('should return false when one badge criterion is not fulfilled', async () => {
        // given
        const partnerCompetenceResults = [
          domainBuilder.buildCompetenceResult({
            id: 1,
            validatedSkillsCount: 9,
            totalSkillsCount: 10,
            badgeId: badge.id,
          }),
          domainBuilder.buildCompetenceResult({
            id: 2,
            validatedSkillsCount: 9,
            totalSkillsCount: 10,
            badgeId: badge.id,
          }),
        ];
        const campaignParticipationBadge = domainBuilder.buildCampaignParticipationBadge({
          id: badge.id,
          isAcquired: true,
          partnerCompetenceResults: partnerCompetenceResults
        });
        const campaignParticipationResult = domainBuilder.buildCampaignParticipationResult({
          badge,
          campaignParticipationBadges: [campaignParticipationBadge],
          validatedSkillsCount: 2,
          totalSkillsCount: 10,
        });
        badge.partnerCompetenceResults = partnerCompetenceResults;

        // when
        const result = await badge.isAcquired({ campaignParticipationResult });

        // then
        expect(result).to.be.equal(false);
      });
    });

  });
});
