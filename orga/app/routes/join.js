import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({

  session: inject(),

  beforeModel() {
    this._super(...arguments);
    if (this.get('session.isAuthenticated')) {
      this.session.noRedirectAfterLogin = true;
      this.session.invalidate();
    }
  },

  model(params) {
    return this.store.queryRecord('organization-invitation', {
      invitationId: params.invitationId,
      code: params.code
    }).catch((errorResponse) => {
      errorResponse.errors.forEach((error) => {
        if (error.status === '421') {
          this.replaceWith('login', { queryParams: { hasInvitationError: true } });
        }
      });
      this.replaceWith('login');
    });
  }
});
