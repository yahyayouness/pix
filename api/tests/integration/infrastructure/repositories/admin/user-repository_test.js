const { expect, databaseBuilder, catchErr } = require('../../../../test-helper');
const faker = require('faker');
const _ = require('lodash');

const { UserNotFoundError } = require('../../../../../lib/domain/errors');
const userRepository = require('../../../../../lib/infrastructure/repositories/admin/user-repository');
const User = require('../../../../../lib/domain/models/admin/User');

describe('Integration | Infrastructure | Repository | UserRepository', () => {

  describe('#get', () => {

    let userInDb;

    it('should return the user', async () => {
      // given
      const userToInsert = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.exampleEmail().toLowerCase(),
        samlId: 'some-saml-id',
      };

      userInDb = databaseBuilder.factory.buildUser(userToInsert);
      await databaseBuilder.commit();

      // when
      const user = await userRepository.get(userInDb.id);

      // then
      expect(user).to.be.an.instanceOf(User);
      expect(user.id).to.equal(userInDb.id);
      expect(user.firstName).to.equal(userInDb.firstName);
      expect(user.lastName).to.equal(userInDb.lastName);
      expect(user.email).to.equal(userInDb.email);
      expect(user.isAuthenticatedFromGAR).to.be.true;
      expect(user.createdAt).to.exist;
      expect(user.updatedAt).to.exist;
    });

    it('should return usr with isAuthenticatedFromGAR at false if user doesn\'t have SAML ID', async () => {
      //given
      const userToInsert = {
        samlId: '',
      };

      userInDb = databaseBuilder.factory.buildUser(userToInsert);
      await databaseBuilder.commit();

      // when
      const user = await userRepository.get(userInDb.id);

      // then
      expect(user.isAuthenticatedFromGAR).to.be.false;
    });

    it('should return a UserNotFoundError if no user is found', async () => {
      // given
      const nonExistentUserId = 678;

      // when
      const result = await catchErr(userRepository.get)(nonExistentUserId);

      // then
      expect(result).to.be.instanceOf(UserNotFoundError);
    });
  });

});
