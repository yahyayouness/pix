import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit | Route | error', function() {
  setupTest();

  it('exists', function() {
    const route = this.owner.lookup('route:error');
    expect(route).to.be.ok;
  });
});
