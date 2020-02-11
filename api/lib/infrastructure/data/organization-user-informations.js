const Bookshelf = require('../bookshelf');

require('./user');
require('./organization');

module.exports = Bookshelf.model('OrganizationUserInformations', {

  tableName: 'organization-user-informations',

  user() {
    return this.belongsTo('User', 'userId');
  },

  currentOrganization() {
    return this.belongsTo('Organization', 'currentOrganizationId');
  },

});
