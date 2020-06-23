import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import sinon from 'sinon';
import createGlimmerComponent from 'mon-pix/tests/helpers/create-glimmer-component';

describe('Unit | Component | feedback-panel', function() {

  setupTest();

  describe('#toggleFeedbackForm', function() {

    let component;
    const feedbackPanelArgs = {
      isFormInitiallyOpened: false
    };

    beforeEach(function() {
      component = createGlimmerComponent('component:feedback-panel', feedbackPanelArgs);
    });

    it('should open form', function() {
      // given
      feedbackPanelArgs.isFormInitiallyOpened = false;

      // when
      component.toggleFeedbackForm();

      // then
      expect(component._isFormOpened).to.be.true;
    });

    it('should close and reset form', function() {
      // given
      feedbackPanelArgs.isFormInitiallyOpened = true;

      // when
      component.toggleFeedbackForm();

      // then
      expect(component._isFormOpened).to.be.false;
      expect(component._isSubmitted).to.be.false;
      expect(component.emptyTextBoxMessageError).to.be.null;
    });
  });

  describe('#sendFeedback', function() {
    let feedback;
    let store;
    let component;

    beforeEach(() => {
      component = createGlimmerComponent('component:feedback-panel');
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
