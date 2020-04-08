class UserDetailsForAdmin {

  constructor(
    {
      id,
      email,
      username,
      firstName,
      lastName,
      isAuthenticatedViaGAR,
    } = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.isAuthenticatedViaGAR = isAuthenticatedViaGAR;
  }
}

module.exports = UserDetailsForAdmin;
