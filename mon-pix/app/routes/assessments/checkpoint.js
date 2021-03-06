import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class CheckpointRoute extends Route {
  model() {
    return this.modelFor('assessments');
  }

  async afterModel(assessment) {

    if (assessment.isCompetenceEvaluation || assessment.isForCampaign) {
      await assessment.belongsTo('progression').reload();
    }

    if (assessment.isForCampaign) {
      const campaigns = await this.store.query('campaign', { filter: { code: assessment.codeCampaign } });

      assessment.set('campaign', campaigns.get('firstObject'));
    }
  }
}
