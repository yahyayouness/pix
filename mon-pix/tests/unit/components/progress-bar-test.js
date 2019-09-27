import { expect } from 'chai';
import { describe, it } from 'mocha';
import EmberObject from '@ember/object';
import { setupTest } from 'ember-mocha';
import { htmlSafe } from '@ember/string';

describe('Unit | Component | progress-bar', function() {

  setupTest();

  describe('@steps', function() {

    it('should return an array of progress step', function() {
      // given
      const assessment = EmberObject.create({
        answers: [{}, {}],
        hasCheckpoints: false,
        course: {
          nbChallenges: 4
        }
      });
      const component = this.owner.lookup('component:progress-bar');
      component.set('assessment', assessment);

      // when
      const steps = component.get('steps');

      // then
      expect(steps).to.deep.equal([
        { stepnum: 1, status: 'complete' },
        { stepnum: 2, status: 'complete' },
        { stepnum: 3, status: 'active' },
        { stepnum: 4, status: '' },
      ]);
    });
  });

  describe('@valueGaugeStyle', function() {

    it('should return the correct width', function() {
      // given
      const assessment = EmberObject.create({
        answers: [{}, {}],
        hasCheckpoints: false,
        course: {
          nbChallenges: 4
        }
      });
      const component = this.owner.lookup('component:progress-bar');
      component.set('assessment', assessment);

      // when
      const valueGaugeStyle = component.get('valueGaugeStyle');

      // then
      expect(valueGaugeStyle).to.deep.equal(htmlSafe('width: 25%'));
    });
  });
});
