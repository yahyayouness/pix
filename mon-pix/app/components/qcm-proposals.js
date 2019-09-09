import { computed } from '@ember/object';
import Component from '@ember/component';
import createProposalAnswerTuples from 'mon-pix/utils/labeled-checkboxes';
import proposalsAsArray from 'mon-pix/utils/proposals-as-array';
import valueAsArrayOfBoolean from 'mon-pix/utils/value-as-array-of-boolean';

const errorMessage = 'Pour valider, sélectionner une réponse. Sinon, passer.';

export default Component.extend({

  answer: null,
  proposals: null,
  answerChanged: null,
  classNames: ['qcm-proposals'],

  init() {
    this._super(...arguments);
    this.set('errorMessage', errorMessage);
  },

  labeledCheckboxes: computed('proposals', 'answer.value', function() {
    const arrayOfProposals = proposalsAsArray(this.proposals);
    const arrayOfBoolean = valueAsArrayOfBoolean(this.get('answer.value'));

    return createProposalAnswerTuples(arrayOfProposals, arrayOfBoolean);
  }),

  _hasError: function() {
    return this._getAnswerValue().length < 1;
  },

  // FIXME refactor that
  _getAnswerValue() {
    return this.$('input[type=checkbox][id^=checkbox_]:checked').map(function() {return this.name; }).get().join(',');
  },

  actions: {
    checkboxCliked() {
      this.set('answerValue', this._getAnswerValue());
      this.set('errorMessage', this._hasError() ? errorMessage : null);

      this.answerChanged();
    }
  }
});
