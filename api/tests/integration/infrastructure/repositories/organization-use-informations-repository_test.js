const { catchErr, expect, knex, databaseBuilder } = require('../../../test-helper');
const OrganizationUserInformations = require('../../../../lib/domain/models/OrganizationUserInformations');
const BookshelfOrganizationUserInformations = require('../../../../lib/infrastructure/data/organization-user-informations');
const organizationUserInformationsRepository = require('../../../../lib/infrastructure/repositories/organization-user-informations-repository');
const { NotFoundError } = require('../../../../lib/domain/errors');

describe('Integration | Repository | OrganizationUserInformations', function() {

  let userId;
  let organizationId;

  beforeEach(async () => {
    userId = databaseBuilder.factory.buildUser().id;
    organizationId = databaseBuilder.factory.buildOrganization().id;
    await databaseBuilder.commit();
  });

  afterEach(async () => {
    await knex('organization-user-informations').delete();
  });

  describe('#create', () => {

    it('should return an OrganizationUserInformations domain object', async () => {
      // when
      const organizationUserInformationsSaved = await organizationUserInformationsRepository.create(userId, organizationId);

      // then
      expect(organizationUserInformationsSaved).to.be.an.instanceof(OrganizationUserInformations);
    });

    it('should add a row in the table "organizations-user-informations"', async () => {
      // given
      const nbBeforeCreation = await BookshelfOrganizationUserInformations.count();

      // when
      await organizationUserInformationsRepository.create(userId, organizationId);

      // then
      const nbAfterCreation = await BookshelfOrganizationUserInformations.count();
      expect(nbAfterCreation).to.equal(nbBeforeCreation + 1);
    });

    it('should save model properties', async () => {
      // when
      const organizationUserInformationsSaved = await organizationUserInformationsRepository.create(userId, organizationId);

      // then
      expect(organizationUserInformationsSaved.id).to.not.be.undefined;
      expect(organizationUserInformationsSaved.user.id).to.equal(userId);
      expect(organizationUserInformationsSaved.currentOrganization.id).to.equal(organizationId);
    });
  });

  describe('#getByUserId', () => {

    beforeEach(async () => {
      databaseBuilder.factory.buildOrganizationUserInformations({ currentOrganizationId: organizationId, userId });
      await databaseBuilder.commit();
    });

    it('should throw a NotFoundError if no organization-user-informations exists for a given user', async () => {
      // given
      const wrongUserId = 456;

      // when
      const error = await catchErr(organizationUserInformationsRepository.getByUserId)(wrongUserId);

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });

    it('should retrieve an organization-user-informations associated to a given user', async () => {
      // when
      const result = await organizationUserInformationsRepository.getByUserId(userId);

      // then
      expect(result).to.be.instanceOf(OrganizationUserInformations);
      expect(result.user.id).to.equal(userId);
    });
  });
});
