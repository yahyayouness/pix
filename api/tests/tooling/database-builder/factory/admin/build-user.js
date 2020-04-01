const faker = require('faker');
const databaseBuffer = require('../database-buffer');
const _ = require('lodash');

const buildUser = function buildUser({
  id,
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
  email,
  username = firstName + '.' + lastName + faker.random.number({ min: 1000, max: 9999 }),
} = {}) {

  email = _.isUndefined(email) ? faker.internet.exampleEmail(firstName, lastName).toLowerCase() : email || null;

  const values = {
    id, firstName, lastName, email, username,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'users',
    values,
  });
};

module.exports = buildUser;
