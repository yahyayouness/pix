import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import sinon from 'sinon';
import createGlimmerComponent from 'mon-pix/tests/helpers/create-glimmer-component';

describe('Unit | Component | feedback-panel', function() {

  setupTest();

  describe('#toggleFeedbackForm', function() {

    let component;
    const feedbackPanel = {
      args: {},
      _scrollToPanel: () => {}
    };

    beforeEach(function() {
      component = createGlimmerComponent('component:feedback-panel', { feedbackPanel });
    });

    it('should open form', function() {
      // when
      component.toggleFeedbackForm();

      // then
      expect(component.args.isFormOpened).to.be.true;
    });

    it('should close and reset form', function() {
      // given
      feedbackPanel.args.isFormOpened = true;
      feedbackPanel.emptyTextBoxMessageError = '10, 9, 8, ...';
      feedbackPanel._isSubmitted = true;

      // when
      component.toggleFeedbackForm();

      // then
      expect(component.isFormOpened).to.be.false;
      expect(component._isSubmitted).to.be.false;
      expect(component.emptyTextBoxMessageError).to.be.null;
    });
  });

  describe('#sendFeedback', function() {
    let feedback;
    let store;
    let component;
    const feedbackPanel = {
      _scrollToPanel: () => {}
    };

    beforeEach(() => {
      component = createGlimmerComponent('component:feedback-panel', { feedbackPanel });
      feedback = {
        save: sinon.stub().resolves(null),
      };
      store = {
        createRecord: sinon.stub().returns(feedback)
      };
    });

    it('should re-initialise the form correctly', async function() {
      // given
      feedback._category = 'CATEGORY';
      feedback._content = 'TEXT';
      feedback.store = store;

      // when
      await component.sendFeedback;

      // then
      expect(component._category).to.be.null;
      expect(component._content).to.be.null;
      expect(component.nextCategory).to.be.null;
    });

  });
});
