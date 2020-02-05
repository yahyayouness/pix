import Service from '@ember/service';
import sinon from 'sinon';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit | Route | logout', () => {
  setupTest();

  let sessionStub;

  it('should disconnect the user', function() {
    // Given
    const invalidateStub = sinon.stub();
    sessionStub = Service.create({ isAuthenticated: true, invalidate: invalidateStub, data: { } });

    const route = this.owner.lookup('route:logout');
    route.set('session', sessionStub);

    // When
    route.beforeModel();

    // Then
    sinon.assert.calledOnce(invalidateStub);
  });
});
