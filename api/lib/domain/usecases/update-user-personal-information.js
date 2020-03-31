module.exports = async function updateUserPersonalInformation({
  id,
  firstName,
  lastName,
  email,
  username,
  userRepository
}) {
  const user = await userRepository.get(id);

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (username) user.username = username;

  await userRepository.updateUserPersonalInformation(user);

  return user;
};
