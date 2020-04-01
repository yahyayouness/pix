const _ = require('lodash');
const UserRepository = require('../../../domain/models/admin/UserRepository');
const BookshelfUser = require('../../data/user');
const { UserNotFoundError } = require('../../../domain/errors');
const User = require('../../../domain/models/admin/User');

function _toDomain(userBookshelf) {
  return new User({
    id: userBookshelf.get('id'),
    firstName: userBookshelf.get('firstName'),
    lastName: userBookshelf.get('lastName'),
    email: userBookshelf.get('email'),
    username: userBookshelf.get('username'),
    isAuthenticatedFromGAR: !!userBookshelf.get('samlId'),
    createdAt: userBookshelf.get('createdAt'),
    updatedAt: userBookshelf.get('updatedAt'),
  });
}

class UserRepositoryImpl extends UserRepository {
  get(id) {
    return BookshelfUser
      .where({ id })
      .fetch({ require: true, withRelated: ['userOrgaSettings'] })
      .then(_toDomain)
      .catch((err) => {
        if (err instanceof BookshelfUser.NotFoundError) {
          throw new UserNotFoundError(`User not found for ID ${id}`);
        }
        throw err;
      });
  }
}

module.exports = new UserRepositoryImpl();

