const _ = require('lodash');

class User {

  constructor({
    id,
    // attributes
    email,
    username,
    firstName,
    lastName,
    isAuthenticatedFromGAR,
    createdAt,
    updatedAt,
    // includes
    // references
  } = {}) {
    this.id = id;
    // attributes
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email ? _.toLower(email) : undefined;
    this.isAuthenticatedFromGAR = isAuthenticatedFromGAR;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    // includes
    // references
  }
}

module.exports = User;
