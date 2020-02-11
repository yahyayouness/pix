module.exports = async function getUserWithOrganizationInformations({ userId, userRepository }) {
  return userRepository.getWithOrganizationInformations(userId);
};
