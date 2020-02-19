import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {

  routeAfterAuthentication: 'authenticated',
  currentUser: service(),

  beforeModel() {
    return this._loadCurrentUser();
  },

  async sessionAuthenticated() {
    await this._loadCurrentUser();
    this._super.call(this, ...arguments);
  },

  sessionInvalidated() {
    this.transitionTo('login');
  },

  _loadCurrentUser() {
    return this.get('currentUser')
      .load()
      .catch(() => this.get('session').invalidate());
  }
});
