import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import buttonStatusTypes from 'mon-pix/utils/button-status-types';

import { topLevelLabels, questions } from 'mon-pix/static-data/feedback-panel-issue-labels';

export default class FeedbackPanel extends Component {
  @service store;

  displayQuestionDropdown = false;
  displayTextBox = null;
  emptyTextBoxMessageError = null;
  nextCategory = null;
  quickHelpInstructions = null;
  sendButtonStatus = buttonStatusTypes.unrecorded;
  _category = null;
  _content = null;
  _isSubmitted = false;
  _questions = questions;

  get categories() {
    const context = this.args.context === 'comparison-window' ? 'displayOnlyOnChallengePage' : 'displayOnlyOnComparisonWindow';
    return topLevelLabels.filter((label) => !label[context]);
  }

  get isSaveButtonDisabled() {
    return this.sendButtonStatus === buttonStatusTypes.pending;
  }

  _resetPanel() {
    this._isSubmitted = false;
    this.emptyTextBoxMessageError = null;
  }

  didReceiveAttrs() {
    super.didReceiveAttrs();
    this._resetPanel();
    this._content = null;
  }

  _showFeedbackActionBasedOnCategoryType(category) {
    this.displayTextBox = false;
    this.quickHelpInstructions = null;

    if (category.type === 'tutorial') {
      this.quickHelpInstructions = category.content;
    } else if (category.type === 'textbox') {
      this.displayTextBox = true;
    }
  }

  _scrollIntoFeedbackPanel() {
    const feedbackPanelElements = document.getElementsByClassName('feedback-panel__view');
    if (feedbackPanelElements && feedbackPanelElements[0]) {
      feedbackPanelElements[0].scrollIntoView();
    }
  }

  @action
  toggleFeedbackForm() {
    if (this.args.isFormOpened) {
      this.args.isFormOpened = false;
      this._resetPanel();
    } else {
      this.args.isFormOpened = true;
      this._scrollIntoFeedbackPanel();
    }
  }

  @action
  async sendFeedback() {
    if (this.isSaveButtonDisabled) {
      return;
    }
    this.sendButtonStatus = buttonStatusTypes.pending;
    const content = this._content;
    const category = this._category;
    const answer = this.args.answer ? this.args.answer.value : null;

    if (isEmpty(content) || isEmpty(content.trim())) {
      this.emptyTextBoxMessageError = 'Vous devez saisir un message.';
      return;
    }

    const feedback = this.store.createRecord('feedback', {
      content,
      category,
      assessment: this.args.assessment,
      challenge: this.args.challenge,
      answer,
    });

    try {
      await feedback.save();
      this._isSubmitted = true;
      this._content = null;
      this._category = null;
      this.nextCategory = null;
      this.displayTextBox = false;
      this.tutorialContent = null;
      this.displayQuestionDropdown = false;
      this.sendButtonStatus = buttonStatusTypes.recorded;
    } catch (error) {
      this.sendButtonStatus = buttonStatusTypes.unrecorded;
    }
  }

  @action
  displayCategoryOptions() {
    this.displayTextBox = false;
    this.quickHelpInstructions = null;
    this.emptyTextBoxMessageError = null;
    this.displayQuestionDropdown = false;

    this.nextCategory = this._questions[event.target.value];
    this._category = event.target.value;

    if (this.nextCategory.length > 1) {
      this.displayQuestionDropdown = true;
    } else {
      this._showFeedbackActionBasedOnCategoryType(this.nextCategory[0]);
    }
  }

  @action
  showFeedback() {
    if (event.target.value === 'default') {
      this.displayTextBox = false;
      this.quickHelpInstructions = null;
      this.emptyTextBoxMessageError = null;
    }

    this.emptyTextBoxMessageError = null;
    this._category = this.nextCategory[event.target.value].name;
    this._showFeedbackActionBasedOnCategoryType(this.nextCategory[event.target.value]);
  }
}
