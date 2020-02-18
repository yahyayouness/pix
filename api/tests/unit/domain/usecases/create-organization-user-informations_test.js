const { domainBuilder, expect, sinon, catchErr } = require('../../../test-helper');
const { createOrganizationUserInformations } = require('../../../../lib/domain/usecases');
const organizationRepository = require('../../../../lib/infrastructure/repositories/organization-repository');
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');
const organizationUserInformationsRepository = require('../../../../lib/infrastructure/repositories/organization-user-informations-repository');
const {  NotFoundError, OrganizationUserInformationsCreationError, UserNotFoundError, } = require('../../../../lib/domain/errors');

describe('Unit | UseCase | create-organization-user-informations', () => {

  let user;
  let organization;
  let organizationUserInformations;
  let getUserStub;
  let getOrganizationStub;
  let getOrganizationUserInformationsStub;
  let createOrganizationUserInformationsStub;

  beforeEach(() => {
    organization = domainBuilder.buildOrganization();
    user = domainBuilder.buildUser();
    organizationUserInformations = domainBuilder.buildOrganizationUserInformations({ organization, user });

    getUserStub = sinon.stub(userRepository, 'get');
    getOrganizationStub = sinon.stub(organizationRepository, 'get');
    getOrganizationUserInformationsStub = sinon.stub(organizationUserInformationsRepository, 'getByUserId');
    createOrganizationUserInformationsStub = sinon.stub(organizationUserInformationsRepository, 'create');
  });

  context('Green cases', () => {
    it('should create organization-user-information', async () => {
      // given
      getUserStub.resolves();
      getOrganizationStub.resolves();
      getOrganizationUserInformationsStub.rejects(new NotFoundError());
      createOrganizationUserInformationsStub.resolves(organizationUserInformations);

      // when
      const result = await createOrganizationUserInformations({ organizationUserInformations });

      // then
      expect(userRepository.get).to.be.calledOnce;
      expect(organizationRepository.get).to.be.calledOnce;
      expect(organizationUserInformationsRepository.getByUserId).to.be.calledOnce;
      expect(result.id).to.exist;
    });
  });

  context('Red cases', () => {

    it('should throw an error when user not found', async () => {
      // given
      getUserStub.rejects(new UserNotFoundError());

      // when
      const error = await catchErr(createOrganizationUserInformations)({ organizationUserInformations });

      // then
      expect(error).to.be.instanceOf(UserNotFoundError);
    });

    it('should throw an error when organization not found', async () => {
      // given
      getOrganizationStub.rejects(new NotFoundError());

      // when
      const error = await catchErr(createOrganizationUserInformations)({ organizationUserInformations });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });

    it('should throw an error when organization user information already exist', async () => {
      // given
      getOrganizationUserInformationsStub.resolves(organizationUserInformations);

      // when
      const error = await catchErr(createOrganizationUserInformations)({ organizationUserInformations });

      // then
      expect(error).to.be.instanceOf(OrganizationUserInformationsCreationError);
    });
  });
});
