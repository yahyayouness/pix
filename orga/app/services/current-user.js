import Service from '@ember/service';
import { inject as service } from '@ember/service';
import _ from 'lodash';

export default Service.extend({

  session: service(),
  store: service(),

  async load() {
    if (this.get('session.isAuthenticated')) {
      try {
        const user = await this.store.queryRecord('user', { me: true });
        const userMemberships = await user.get('memberships');
        const organizationUserInformations = await user.get('organizationUserInformations');

        this.set('user', user);
        this.set('memberships', userMemberships);

        if (organizationUserInformations) {
          const currentOrganization = await organizationUserInformations.get('organization');
          return this.setMainOrganization(currentOrganization.id);
        }

        const firstMembership = await userMemberships.get('firstObject');
        return this._setOrganizationValues(firstMembership);
      } catch (error) {
        if (_.get(error, 'errors[0].code') === 401) {
          return this.session.invalidate();
        }
      }
    }
  },

  async setMainOrganization(organizationId) {
    const user = this.get('user');
    const memberships = await user.get('memberships').toArray();
    for (const membership of memberships) {
      const organization = await membership.get('organization');
      if (organization.id === organizationId) {
        return this._setOrganizationValues(membership);
      }
    }
  },

  async _setOrganizationValues(membership) {
    const organization = await membership.organization;
    const isAdminInOrganization = membership.isAdmin;
    const canAccessStudentsPage = organization.isSco && organization.isManagingStudents;

    this.set('organization', organization);
    this.set('isAdminInOrganization', isAdminInOrganization);
    this.set('canAccessStudentsPage', canAccessStudentsPage);
  }
});
