import { computed } from '@ember/object';
import Component from '@ember/component';
import ENV from 'mon-pix/config/environment';
import { htmlSafe } from '@ember/string';

const FIRST_STEP_INDEX = 0;
const CHECKPOINTS_MAX_STEPS = ENV.APP.NUMBER_OF_CHALLENGES_BETWEEN_TWO_CHECKPOINTS;

export default Component.extend({

  _challengesToAnswerCount: computed('assessment.{hasCheckpoints,course.nbChallenges}', function() {
    if (this.get('assessment.hasCheckpoints')) {
      return CHECKPOINTS_MAX_STEPS;
    } else {
      return this.get('assessment.course.nbChallenges');
    }
  }),

  steps: computed('assessment.answers.length', '_challengesToAnswerCount', function() {
    const steps = [];
    const answersCount = this.get('assessment.answers.length');
    const currentStepnum = FIRST_STEP_INDEX + answersCount % this._challengesToAnswerCount;

    for (let i = 0; i < this._challengesToAnswerCount; i++) {
      const status = i < currentStepnum ? 'complete' : i === currentStepnum ? 'active' : '';
      steps.push({
        stepnum: i + 1,
        status,
      });
    }

    return steps;
  }),

  valueGaugeStyle: computed('_challengesToAnswerCount', function() {
    const valueGauge = 100 / this._challengesToAnswerCount;

    return htmlSafe(`width: ${valueGauge}%`);
  }),
});
