const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
const { updateUserPersonalInformation } = require('../../../../lib/domain/usecases');
const { NotFoundError } = require('../../../../lib/domain/errors');

describe('Unit | UseCase | update-user-personal-information', () => {

  let originalUser;
  let userRepository;

  beforeEach(() => {
    originalUser = domainBuilder.buildUser({
      firstName: 'original_first_name',
      lastName: 'original_last_name',
      email: 'original_email',
      username: 'original_username',
      password: 'Pix1024#',
      cgu: true,
    });
    userRepository = {
      get: sinon.stub().resolves(originalUser),
      updateUserPersonalInformation: sinon.stub().callsFake((modifiedUser) => modifiedUser)
    };
  });

  context('when user exists', () => {

    it('should allow to update the user first name name (only) if modified', async () => {
      // given
      const newFirstName = 'New first name';

      // when
      const updatedUser = await updateUserPersonalInformation({
        id: originalUser.id,
        firstName: newFirstName,
        userRepository
      });

      // then
      expect(updatedUser.firstName).to.equal(newFirstName);
      expect(updatedUser.password).to.equal(originalUser.password);
    });

    it('should allow to update the user last name name (only) if modified', async () => {
      // given
      const newLastName = 'New last name';

      // when
      const updatedUser = await updateUserPersonalInformation({
        id: originalUser.id,
        lastName: newLastName,
        userRepository
      });

      // then
      expect(updatedUser.lastName).to.equal(newLastName);
      expect(updatedUser.password).to.equal(originalUser.password);
    });

    it('should allow to update the user email name (only) if modified', async () => {
      // given
      const newEmail = 'New email';

      // when
      const updatedUser = await updateUserPersonalInformation({
        id: originalUser.id,
        email: newEmail,
        userRepository
      });

      // then
      expect(updatedUser.email).to.equal(newEmail);
      expect(updatedUser.password).to.equal(originalUser.password);
    });

    it('should allow to update the user username name (only) if modified', async () => {
      // given
      const newUsername = 'New username';

      // when
      const updatedUser = await updateUserPersonalInformation({
        id: originalUser.id,
        username: newUsername,
        userRepository
      });

      // then
      expect(updatedUser.username).to.equal(newUsername);
      expect(updatedUser.password).to.equal(originalUser.password);
    });
  });

  context('when an error occurred', () => {

    it('should reject a NotFoundError (DomainError) when the user does not exist', async () => {
      // given
      userRepository.get = sinon.stub().rejects(new NotFoundError('Not found user'));

      // when
      const error = await catchErr(updateUserPersonalInformation)({
        id: originalUser.id,
        userRepository
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });
});
