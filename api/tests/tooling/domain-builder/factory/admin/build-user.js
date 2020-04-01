const User = require('../../../../lib/domain/models/User');

module.exports = function buildUser(
  {
    id = 1,
    firstName = 'Jean',
    lastName = 'Bono',
    email = 'jean.bono@example.net',
    username = 'jean.bono1234',
    isAuthenticatedFromGAR,
    createdAt = '2020-04-01',
    updatedAt = '2020-04-01'
  } = {}) {

  return new User({
    id, firstName, lastName, email, username, isAuthenticatedFromGAR, createdAt, updatedAt
  });
};
