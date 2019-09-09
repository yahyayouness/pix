import Component from '@ember/component';
import { computed } from '@ember/object';
import proposalsAsBlocks from 'mon-pix/utils/proposals-as-blocks';
import jsyaml from 'js-yaml';
import $ from 'jquery';
import _ from 'mon-pix/utils/lodash-custom';

const errorMessage = 'Pour valider, saisir au moins une réponse. Sinon, passer.';

export default Component.extend({

  classNames: ['qrocm-proposal'],

  proposals: null,
  answer: null,
  answersValue: null,
  answerChanged: null, // action

  init() {
    this._super(...arguments);
    this.set('errorMessage', errorMessage);
  },

  _blocks: computed('proposals', function() {
    return proposalsAsBlocks(this.proposals);
  }),

  didInsertElement: function() {
    this.$('input').keydown(() => {
      this.set('answerValue', this._getAnswerValue());
      this.set('errorMessage', this._hasError() ? errorMessage : null);

      this.answerChanged();
    });
  },

  _hasError: function() {
    const allAnswers = this._getRawAnswerValue(); // ex. {"logiciel1":"word", "logiciel2":"excel", "logiciel3":""}
    const hasAtLeastOneAnswer = _(allAnswers).hasSomeTruthyProps();
    return _.isFalsy(hasAtLeastOneAnswer);
  },

  _getAnswerValue() {
    return jsyaml.safeDump(this._getRawAnswerValue());
  },

  // XXX : data is extracted from DOM of child component, breaking child encapsulation.
  // This is not "the Ember way", however it makes code easier to read,
  // and moreover, is a much more robust solution when you need to test it properly.
  _getRawAnswerValue() {
    const result = {};
    $('.challenge-proposals input').each(function(index, element) {
      result[$(element).attr('name')] = $(element).val();
    });
    return result;
  },

});
