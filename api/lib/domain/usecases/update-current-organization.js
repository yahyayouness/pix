module.exports = async function updateCurrentOrganization({
  userId,
  organizationId,
  userRepository
}) {

  await userRepository.updateCurrentOrganization(userId, organizationId);

  return userId;
};
