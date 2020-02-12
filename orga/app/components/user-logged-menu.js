import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({

  classNames: ['logged-user-container'],

  currentUser: service(),
  store: service(),
  router: service(),

  isMenuOpen: false,

  organizations: computed('currentUser.organization', function() {
    const memberships = this.currentUser.memberships;
    if (!memberships) {
      return [];
    }
    return memberships.toArray()
      .map((membership) => membership.organization)
      .filter((organization) => organization.get('id') !== this.currentUser.organization.id)
      .sort((a, b) => a.get('name').localeCompare(b.get('name')));
  }),

  organizationNameAndExternalId: computed('currentUser.organization.name', function() {
    const organization = this.currentUser.organization;
    if (!organization) {
      return '';
    }
    if (organization.externalId) {
      return `${organization.name} (${organization.externalId})`;
    }
    return organization.name;
  }),

  actions: {
    toggleUserMenu() {
      this.toggleProperty('isMenuOpen');
    },

    closeMenu() {
      this.set('isMenuOpen', false);
    },

    async onOrganizationChange(organization) {
      const user = this.currentUser.user;
      const userId = user.get('id');
      const organizationUserInformationsId = user.organizationUserInformations.get('id');

      const organizationUserInformation = await this.store.peekRecord('organization-user-information', organizationUserInformationsId);
      const newOrga = await this.store.peekRecord('organization', organization.get('id'));

      organizationUserInformation.set('organization', newOrga);

      organizationUserInformation.save({ adapterOptions: { userId } });

      await this.currentUser.load();

      this.router.replaceWith('/');
    }
  }

});
