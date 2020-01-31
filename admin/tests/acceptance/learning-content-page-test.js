import { module, test } from 'qunit';
import { currentURL, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateSession } from 'ember-simple-auth/test-support';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | tools | learning content page', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    await authenticateSession({ userId: 1 });
  });

  module('Access', function() {

    test('Tools page should be accessible from /tools', async function(assert) {
      // when
      await visit('/tools/learning-content');

      // then
      assert.equal(currentURL(), '/tools/learning-content');
    });
  });

  module('Rendering', function(hooks) {

    hooks.beforeEach(async function() {
      await visit('/tools/learning-content');
    });

    test('Should content "Learning content" section', async function(assert) {
      assert.dom('section.learning-content').exists();
      assert.dom('button.btn-refresh-cache').exists();
    });
  });

});
