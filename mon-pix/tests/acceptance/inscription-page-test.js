import { find } from '@ember/test-helpers';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import visit from '../helpers/visit';
import { setupApplicationTest } from 'ember-mocha';
import { setupMirage } from 'ember-cli-mirage/test-support';

describe('Acceptance | Page | Inscription', function() {
  setupApplicationTest();
  setupMirage();

  let intl;

  beforeEach(function() {
    intl = this.owner.lookup('service:intl');
  });

  it('should contain a link to "Terms of service" page', async function() {
    await visit('/inscription');
    const cguText = intl.t('signup-form.fields.cgu.label');

    expect(find('.signup-form__cgu').innerHTML).to.contains(cguText);
    expect(find('.signup-form__cgu .link')).to.exist;
  });

});
