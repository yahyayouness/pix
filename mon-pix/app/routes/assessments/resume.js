import BaseRoute from 'mon-pix/routes/base-route';
import ENV from 'mon-pix/config/environment';

export default BaseRoute.extend({

  hasSeenCheckpoint: false,
  campaignCode: null,

  beforeModel({ queryParams }) {
    this.set('hasSeenCheckpoint', queryParams.hasSeenCheckpoint);
    this.set('campaignCode', queryParams.campaignCode);
    return this._super(...arguments);
  },

  afterModel(assessment) {
    return this.get('store')
      .queryRecord('challenge', { assessmentId: assessment.get('id') })
      .then((nextChallenge) => {

        if (assessment.isPlacement || assessment.isDemo || assessment.isCertification || assessment.isPreview) {
          return this._resumeAssessmentPlacement(assessment, nextChallenge);
        }
        if (assessment.isSmartPlacement) {
          return this._resumeAssesmentSmartPlacement(assessment, nextChallenge);
        }

        throw new Error('This transition should not be happening');
      });
  },

  actions: {
    loading(transition, originRoute) {
      // allows the loading template to be shown or not
      return originRoute._router.currentRouteName !== 'assessments.challenge';
    }
  },

  _resumeAssessmentPlacement(assessment, nextChallenge) {
    const {
      nextChallengeId,
      assessmentIsFinished,
      assessmentIsCompleted
    } = this._parseState(assessment, nextChallenge);

    if (assessmentIsFinished || assessmentIsCompleted) {
      return this._rateAssessment(assessment);
    }
    return this._routeToNextChallenge(assessment, nextChallengeId);
  },

  _resumeAssesmentSmartPlacement(assessment, nextChallenge) {
    const {
      nextChallengeId,
      assessmentIsFinished,
      assessmentIsCompleted,
      userHasSeenCheckpoint,
      userHasReachedCheckpoint
    } = this._parseState(assessment, nextChallenge);

    if (assessmentIsCompleted) {
      return this._rateAssessment(assessment);
    }
    if (assessmentIsFinished && userHasSeenCheckpoint) {
      return this._rateAssessment(assessment);
    }
    if (assessmentIsFinished && !userHasSeenCheckpoint) {
      return this._routeToFinalCheckpoint(assessment);
    }
    if (userHasReachedCheckpoint && !userHasSeenCheckpoint) {
      return this._routeToCheckpoint(assessment);
    }
    if (userHasReachedCheckpoint && userHasSeenCheckpoint) {
      return this._routeToNextChallenge(assessment, nextChallengeId);
    }
    return this._routeToNextChallenge(assessment, nextChallengeId);
  },

  _parseState(assessment, nextChallenge) {
    const assessmentIsFinished = !nextChallenge;
    const userHasSeenCheckpoint = this.get('hasSeenCheckpoint');
    const userHasReachedCheckpoint = assessment.get('answers.length') > 0 && assessment.get('answers.length') % ENV.APP.NUMBER_OF_CHALLENGE_BETWEEN_TWO_CHECKPOINTS_IN_SMART_PLACEMENT === 0;
    const nextChallengeId = !assessmentIsFinished && nextChallenge.get('id');
    const assessmentIsCompleted = assessment.get('isCompleted');

    return {
      assessmentIsFinished,
      userHasSeenCheckpoint,
      userHasReachedCheckpoint,
      nextChallengeId,
      nextChallenge,
      assessmentIsCompleted
    };
  },

  _routeToNextChallenge(assessment, nextChallengeId) {
    assessment.incrementProperty('nbCurrentAnswers');
    return this.replaceWith('assessments.challenge', assessment.get('id'), nextChallengeId);
  },

  _rateAssessment(assessment) {
    return this.replaceWith('assessments.rating', assessment.get('id'));
  },

  _routeToCheckpoint(assessment) {
    assessment.set('nbCurrentAnswers', 0);
    return this.replaceWith('assessments.checkpoint', assessment.get('id'));
  },

  _routeToFinalCheckpoint(assessment) {
    return this.replaceWith('assessments.checkpoint', assessment.get('id'), { queryParams: { finalCheckpoint: true } });
  },

});
