const profileV2Serializer = require('../../infrastructure/serializers/jsonapi/profileV2-serializer');
const usecases = require('../../domain/usecases');

module.exports = {

  get(request) {
    const userId = request.auth.credentials.userId;

    return usecases.getProfileV2({
      userId,
    }).then(profileV2Serializer.serialize);
  },
};
