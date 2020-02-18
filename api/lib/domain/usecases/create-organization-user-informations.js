const { OrganizationUserInformationsCreationError } = require('../errors');

module.exports = async function createOrganizationUserInformations({
  organizationId,
  userId,
  userRepository,
  organizationRepository,
  organizationUserInformationsRepository
}) {

  await userRepository.get(userId);
  await organizationRepository.get(organizationId);

  try {
    await organizationUserInformationsRepository.getByUserId(userId);
  } catch (err) {
    return organizationUserInformationsRepository.create(userId, organizationId);
  }
  throw new OrganizationUserInformationsCreationError();

};
