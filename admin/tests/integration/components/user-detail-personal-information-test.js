import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | user-detail-personal-information', function(hooks) {
  setupRenderingTest(hooks);

  test('should display user’s first name', async function(assert) {
    this.set('user', { firstName: 'John' });

    await render(hbs`<UserDetailPersonalInformation @user={{this.user}}/>`);

    assert.dom('.user__first-name').hasText(this.user.firstName);
  });

  test('should display user’s last name', async function(assert) {
    this.set('user', { lastName: 'Snow' });

    await render(hbs`<UserDetailPersonalInformation @user={{this.user}}/>`);

    assert.dom('.user__last-name').hasText(this.user.lastName);
  });

  test('should display user’s email', async function(assert) {
    this.set('user', { email: 'john.snow@winterfell.got' });

    await render(hbs`<UserDetailPersonalInformation @user={{this.user}}/>`);

    assert.dom('.user__email').hasText(this.user.email);
  });

  test('should display user’s username', async function(assert) {
    this.set('user', { username: 'kingofthenorth' });

    await render(hbs`<UserDetailPersonalInformation @user={{this.user}}/>`);

    assert.dom('.user__username').hasText(this.user.username);
  });

  test('should display user’s GAR ID', async function(assert) {
    this.set('user', { samlId: 'GAR-ENT-1029373' });

    await render(hbs`<UserDetailPersonalInformation @user={{this.user}}/>`);

    assert.dom('.user__garId').hasText(this.user.samlId);
  });
});
