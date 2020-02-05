import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import ENV from 'mon-pix/config/environment';

import Route from '@ember/routing/route';
import Ember from 'ember';

import { inject as service } from '@ember/service';

export default Route.extend(ApplicationRouteMixin, {

  splash: service(),
  currentUser: service(),
  session: service(),

  activate() {
    this.splash.hide();
  },

  _checkForURLAuthentication(transition) {
    if (transition.to.queryParams && transition.to.queryParams.token) {
      return this.session.authenticate(
        'authenticator:oauth2', { token: transition.to.queryParams.token }
      );
    }
  },

  async beforeModel(transition) {
    await this._checkForURLAuthentication(transition);
    return this._loadCurrentUser();
  },

  async sessionAuthenticated() {
    const _super = this._super;
    await this._loadCurrentUser();
    this.set('isExternalLogin', this.get('session.data.authenticated.source') === 'external');
    _super.call(this, ...arguments);
  },

  // We need to override the sessionInvalidated from ApplicationRouteMixin
  // to customize the reloaded URL on session invalidation
  // https://github.com/simplabs/ember-simple-auth/blob/a3d51d65b7d8e3a2e069c0af24aca2e12c7c3a95/addon/mixins/application-route-mixin.js#L132
  sessionInvalidated() {
    if (!Ember.testing) {
      if (this.get('isExternalLogin')) {
        window.location.replace('/nonconnecte');
      } else {
        window.location.replace(ENV.APP.HOME_HOST);
      }
    }
  },

  _loadCurrentUser() {
    return this.currentUser.load().catch(() => this.session.invalidate());
  }

});
