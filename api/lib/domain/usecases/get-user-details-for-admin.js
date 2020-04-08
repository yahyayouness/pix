module.exports = function getUserDetailsForAdmin({ userId, userRepository }) {
  const userDetailsForAdmin = userRepository.getDetailsForAdmin(userId);
  return response;
};
