const organizationUserInformationsSerializer = require('../../infrastructure/serializers/jsonapi/organization-user-informations-serializer');
const { OrganizationUserInformationsCreationError } = require('../../domain/errors');
const usecases = require('../../domain/usecases');

module.exports = {

  async create(request, h) {
    const authenticatedUserId = request.auth.credentials.userId;
    const userId = request.payload.data.relationships.user.data.id;
    const organizationId = request.payload.data.relationships.organization.data.id;

    if (authenticatedUserId !== userId) {
      throw new OrganizationUserInformationsCreationError();
    }

    const result = await usecases.createOrganizationUserInformations({ userId, organizationId });

    return h.response(organizationUserInformationsSerializer.serialize(result)).created();
  },

  update() {
    return null;
  }
};
