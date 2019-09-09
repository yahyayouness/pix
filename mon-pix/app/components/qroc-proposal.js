import { computed } from '@ember/object';
import Component from '@ember/component';
import  proposalsAsBlocks from 'mon-pix/utils/proposals-as-blocks';

const errorMessage = 'Pour valider, saisir une réponse. Sinon, passer.';

export default Component.extend({

  classNames: ['qroc-proposal'],

  proposals: null,
  answer: null,
  answerChanged: null, // action

  init() {
    this._super(...arguments);
    this.set('errorMessage', errorMessage);
  },

  _blocks: computed('proposals', function() {
    return proposalsAsBlocks(this.proposals);
  }),

  userAnswer : computed('answer.value', function() {
    const answerValue = this.get('answer.value') || '';
    return answerValue.indexOf('#ABAND#') > -1 ? '' : answerValue;
  }),

  didInsertElement: function() {
    this.$('input').keydown(() => {
      this.set('answerValue', this._getAnswerValue());
      this.set('errorMessage', this._hasError() ? errorMessage : null);

      this.answerChanged();
    });
  },

  _hasError: function() {
    return this._getAnswerValue().length < 1;
  },

  // FIXME refactor that
  _getAnswerValue() {
    return this.$('input[data-uid="qroc-proposal-uid"]').val();
  },

});
