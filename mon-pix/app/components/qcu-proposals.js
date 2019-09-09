import { computed } from '@ember/object';
import Component from '@ember/component';
import labeledCheckboxes from 'mon-pix/utils/labeled-checkboxes';
import proposalsAsArray from 'mon-pix/utils/proposals-as-array';
import valueAsArrayOfBoolean from 'mon-pix/utils/value-as-array-of-boolean';

const errorMessage = 'Pour valider, sélectionner une réponse. Sinon, passer.';

export default Component.extend({

  answer: null,
  proposals: null,
  answerChanged: null, // action

  init() {
    this._super(...arguments);
    this.set('errorMessage', errorMessage);
  },

  labeledRadios: computed('proposals', 'answer.value', function() {
    const arrayOfProposals = proposalsAsArray(this.proposals);
    return labeledCheckboxes(arrayOfProposals, valueAsArrayOfBoolean(this.get('answer.value')));
  }),

  _uncheckAllRadioButtons() {
    this.$(':radio').prop('checked', false);
  },

  _checkAgainTheSelectedOption(index) {
    this.$(`:radio:nth(${index})`).prop('checked', true);
  },

  _hasError: function() {
    return this._getAnswerValue().length < 1;
  },

  // FIXME refactor this
  _getAnswerValue() {
    return this.$('input:radio:checked').map(function() {
      return this.getAttribute('data-value');
    }).get().join('');
  },

  actions: {
    radioClicked(index) {
      this.set('answerValue', this._getAnswerValue());
      this.set('errorMessage', this._hasError() ? errorMessage : null);

      this._uncheckAllRadioButtons();
      this._checkAgainTheSelectedOption(index);
      this.answerChanged();
    }
  }

});
