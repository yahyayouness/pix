const campaignParticipationSerializer = require('../../infrastructure/serializers/jsonapi/campaign-participation-serializer');
const certificationCenterMembershipSerializer = require('../../infrastructure/serializers/jsonapi/certification-center-membership-serializer');
const certificationProfileSerializer = require('../../infrastructure/serializers/jsonapi/certification-profile-serializer');
const membershipSerializer = require('../../infrastructure/serializers/jsonapi/membership-serializer');
const userOrgaSettingsSerializer = require('../../infrastructure/serializers/jsonapi/user-orga-settings-serializer');
const pixScoreSerializer = require('../../infrastructure/serializers/jsonapi/pix-score-serializer');
const scorecardSerializer = require('../../infrastructure/serializers/jsonapi/scorecard-serializer');
const userSerializer = require('../../infrastructure/serializers/jsonapi/user-serializer');
const queryParamsUtils = require('../../infrastructure/utils/query-params-utils');

const usecases = require('../../domain/usecases');

module.exports = {

  async save(request, h) {
    const { 'recaptcha-token': reCaptchaToken } = request.payload.data.attributes;
    const user = userSerializer.deserialize(request.payload);

    const createdUser = await usecases.createUser({ user, reCaptchaToken });

    const serializedUser = userSerializer.serialize(createdUser);

    return h.response(serializedUser).created();
  },

  async updateUserPersonalInformation(request) {
    const id = request.payload.data.id;
    const {
      'first-name': firstName,
      'last-name': lastName,
      'email': email,
      'username': username,
    } = request.payload.data.attributes;

    const updatedUser = await usecases.updateUserPersonalInformation({ id, firstName, lastName, email, username });

    return userSerializer.serialize(updatedUser);
  },

  getCurrentUser(request) {
    const authenticatedUserId = request.auth.credentials.userId;

    return usecases.getCurrentUser({ authenticatedUserId })
      .then(userSerializer.serialize);
  },

  async updatePassword(request) {
    const userId = parseInt(request.params.id);
    const user = userSerializer.deserialize(request.payload);

    const updatedUser = await usecases.updateUserPassword({
      userId,
      password: user.password,
      temporaryKey: request.query['temporary-key'] || '',
    });

    return userSerializer.serialize(updatedUser);
  },

  async acceptPixOrgaTermsOfService(request) {
    const authenticatedUserId = request.auth.credentials.userId;

    const updatedUser = await usecases.acceptPixOrgaTermsOfService({
      userId: authenticatedUserId
    });

    return userSerializer.serialize(updatedUser);
  },

  async acceptPixCertifTermsOfService(request) {
    const authenticatedUserId = request.auth.credentials.userId;

    const updatedUser = await usecases.acceptPixCertifTermsOfService({
      userId: authenticatedUserId
    });

    return userSerializer.serialize(updatedUser);
  },

  async rememberUserHasSeenAssessmentInstructions(request) {
    const authenticatedUserId = request.auth.credentials.userId;

    const updatedUser = await usecases.rememberUserHasSeenAssessmentInstructions({ userId: authenticatedUserId });
    return userSerializer.serialize(updatedUser);
  },

  getMemberships(request) {
    const authenticatedUserId = request.auth.credentials.userId;

    return usecases.getUserWithMemberships({ userId: authenticatedUserId })
      .then((user) => membershipSerializer.serialize(user.memberships));
  },

  getCertificationCenterMemberships(request) {
    const authenticatedUserId = request.auth.credentials.userId;

    return usecases.getUserCertificationCenterMemberships({ userId: authenticatedUserId })
      .then((certificationCenterMemberships) => certificationCenterMembershipSerializer.serialize(certificationCenterMemberships));
  },

  async findPaginatedFilteredUsers(request) {
    const options = queryParamsUtils.extractParameters(request.query);

    const { models: users, pagination } = await usecases.findPaginatedFilteredUsers({
      filter: options.filter,
      page: options.page
    });
    return userSerializer.serialize(users, pagination);
  },

  getCampaignParticipations(request) {
    const authenticatedUserId = request.auth.credentials.userId;

    return usecases.findLatestOngoingUserCampaignParticipations({ userId: authenticatedUserId })
      .then(campaignParticipationSerializer.serialize);
  },

  getCertificationProfile(request) {
    const authenticatedUserId = request.auth.credentials.userId;

    return usecases.getUserCurrentCertificationProfile({ userId: authenticatedUserId })
      .then(certificationProfileSerializer.serialize);
  },

  getPixScore(request) {
    const authenticatedUserId = request.auth.credentials.userId;

    return usecases.getUserPixScore({ userId: authenticatedUserId })
      .then(pixScoreSerializer.serialize);
  },

  getScorecards(request) {
    const authenticatedUserId = request.auth.credentials.userId;

    return usecases.getUserScorecards({ userId: authenticatedUserId })
      .then(scorecardSerializer.serialize);
  },

  resetScorecard(request) {
    const authenticatedUserId = request.auth.credentials.userId;
    const competenceId = request.params.competenceId;

    return usecases.resetScorecard({ userId: authenticatedUserId, competenceId })
      .then(scorecardSerializer.serialize);
  },

  getUserOrgaSettings(request) {
    const authenticatedUserId = request.auth.credentials.userId;

    return usecases.getUserWithOrgaSettings({ userId: authenticatedUserId })
      .then((user) => userOrgaSettingsSerializer.serialize(user.userOrgaSettings));
  }
};
