const { expect, sinon, domainBuilder } = require('../../../test-helper');
const getUserWithOrganizationInformations = require('../../../../lib/domain/usecases/get-user-with-organization-informations');
const User = require('../../../../lib/domain/models/User');

describe('Unit | UseCase | get-user-with-organization-informations', () => {

  let userRepository;

  beforeEach(() => {
    userRepository = { getWithOrganizationInformations: sinon.stub() };
  });

  it('should return a User with its Memberships', async () => {
    // given
    const fetchedUser = domainBuilder.buildUser();
    userRepository.getWithOrganizationInformations.resolves(fetchedUser);

    // when
    const result = await getUserWithOrganizationInformations({
      userId: fetchedUser.id,
      userRepository,
    });

    // then
    expect(result).to.be.an.instanceOf(User);
    expect(result).to.equal(fetchedUser);
    expect(userRepository.getWithOrganizationInformations).to.have.been.calledOnce;
  });
});
