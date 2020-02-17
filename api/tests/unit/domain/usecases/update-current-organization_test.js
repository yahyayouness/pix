const updateCurrentOrganization = require('../../../../lib/domain/usecases/update-current-organization');

const { sinon } = require('../../../test-helper');

const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');

describe('Unit | UseCase | update-current-organization', () => {

  const userId = 1;
  const organizationId = 3;

  beforeEach(() => {
    sinon.stub(userRepository, 'updateCurrentOrganization');
  });

  it('should check if user has a current password reset demand', async () => {
    // when
    await updateCurrentOrganization({
      userId,
      organizationId,
      userRepository
    });

    // then
    sinon.assert.calledOnce(userRepository.updateCurrentOrganization);
    sinon.assert.calledWith(userRepository.updateCurrentOrganization, userId, organizationId);
  });
});
