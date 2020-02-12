import { JSONAPISerializer } from 'ember-cli-mirage';

const relationshipsToInclude = ['organizationUserInformations'];

export default JSONAPISerializer.extend({

  include: relationshipsToInclude,

  links(user) {
    return {
      'memberships': {
        related: `/api/users/${user.id}/memberships`
      },
      'organization-user-informations': {
        related: `/api/users/${user.id}/organization-user-informations`
      }
    };
  }
});
