const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
const BookshelfOrganizationUserInformations = require('../data/organization-user-informations');
const { NotFoundError } = require('../../domain/errors');

function _checkNotFoundError(error, userId) {
  if (error instanceof BookshelfOrganizationUserInformations.NotFoundError) {
    throw new NotFoundError(`Not found organization-user-informations for userID ${userId}`);
  }
  throw error;
}

module.exports = {

  getByUserId(userId) {
    return BookshelfOrganizationUserInformations
      .where({ userId })
      .fetch({ require: true, withRelated: ['user'] })
      .then((organizationUserInformations) => bookshelfToDomainConverter.buildDomainObject(BookshelfOrganizationUserInformations, organizationUserInformations))
      .catch((err) => _checkNotFoundError(err, userId));
  },

  create(userId, currentOrganizationId) {
    return new BookshelfOrganizationUserInformations({ userId, currentOrganizationId })
      .save()
      .then((bookshelfOrganizationUserInformations) => bookshelfOrganizationUserInformations.load(['user', 'currentOrganization']))
      .then((organizationUserInformations) => bookshelfToDomainConverter.buildDomainObject(BookshelfOrganizationUserInformations, organizationUserInformations))
      .catch((err) => console.log(err));
  }
};
