import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    async saveAnswerAndNavigate(challenge, assessment, answerValue, answerTimeout, answerElapsedTime) {
      const answer = this.store.createRecord('answer', {
        value: answerValue,
        timeout: answerTimeout,
        elapsedTime: answerElapsedTime,
        assessment,
        challenge,
      });

      await answer.save();

      return this._transitionToResume(assessment);
    },

    resumeAssessment(assessment) {
      return this._transitionToResume(assessment);
    }
  },

  _transitionToResume(assessment) {
    return this.transitionToRoute('assessments.resume', assessment.id);
  },
});
