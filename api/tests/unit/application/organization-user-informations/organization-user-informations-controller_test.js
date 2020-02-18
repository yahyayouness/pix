const { sinon, expect, hFake, catchErr } = require('../../../test-helper');

const OrganizationUserInformations = require('../../../../lib/domain/models/OrganizationUserInformations');
const User = require('../../../../lib/domain/models/User');
const Organization = require('../../../../lib/domain/models/Organization');

const { OrganizationUserInformationsCreationError } = require('../../../../lib/domain/errors');

const organizationUserInformationsController = require('../../../../lib/application/organization-user-informations/organization-user-informations-controller');

const usecases = require('../../../../lib/domain/usecases');

const organizationUserInformationsSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/organization-user-informations-serializer');

describe('Unit | Controller | organization-user-informations-controller', () => {

  describe('#create', () => {
    const userId = 123;
    const organizationId = 234;

    const organizationUserInformations = new OrganizationUserInformations({ user: new User({ id: userId }), organization: new Organization({ id: organizationId }) });

    let request;

    beforeEach(() => {
      request = {
        auth: { credentials: { userId } },
        payload: {
          data: {
            relationships: {
              organization: {
                data: {
                  id: organizationId,
                  type: 'organizations'
                }
              },
              user: {
                data: {
                  id: userId,
                  type: 'users'
                }
              }
            },
          },
        },
      };

      sinon.stub(organizationUserInformationsSerializer, 'deserialize').returns(organizationUserInformations);
      sinon.stub(organizationUserInformationsSerializer, 'serialize');
      sinon.stub(usecases, 'createOrganizationUserInformations');
    });

    describe('when request is valid', () => {

      beforeEach(() => {
        usecases.createOrganizationUserInformations.resolves(organizationUserInformations);
      });

      it('should return a serialized user and a 201 status code', async () => {
        // given
        const expectedSerializedOrganizationUserInformations = { message: 'serialized user' };
        organizationUserInformationsSerializer.serialize.returns(expectedSerializedOrganizationUserInformations);

        // when
        const response = await organizationUserInformationsController.create(request, hFake);

        // then
        expect(organizationUserInformationsSerializer.serialize).to.have.been.calledWith(organizationUserInformations);
        expect(response.source).to.deep.equal(expectedSerializedOrganizationUserInformations);
        expect(response.statusCode).to.equal(201);
      });

      it('should call the organization user informations creation usecase', async () => {
        // when
        await organizationUserInformationsController.create(request, hFake);

        // then
        expect(usecases.createOrganizationUserInformations).to.have.been.calledWith({ userId, organizationId });
      });
    });

    describe('when request in not valid', function() {

      it('should throw a OrganizationUserInformationsCreationError when payload user and connected user are not the same', async () => {
        // given
        request.auth.credentials.userId = 321;

        // when
        const error = await catchErr(organizationUserInformationsController.create)(request, hFake);

        // then
        expect(error).to.be.instanceof(OrganizationUserInformationsCreationError);
      });
    });
  });
});
