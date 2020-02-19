import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

  currentUser: service(),

  beforeModel() {
    debugger;
    if (this.currentUser.user.pixOrgaTermsOfServiceAccepted) {
      return this.transitionTo('authenticated.campaigns');
    } else {
      return this.transitionTo('authenticated.terms-of-service');
    }
  }
});
