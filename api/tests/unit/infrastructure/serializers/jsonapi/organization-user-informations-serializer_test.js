const { expect, domainBuilder } = require('../../../../test-helper');
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/organization-user-informations-serializer');
const OrganizationUserInformations = require('../../../../../lib/domain/models/OrganizationUserInformations');

describe('Unit | Serializer | JSONAPI | organization-user-informations-serializer', () => {

  describe('#serialize', () => {

    it('should convert a OrganizationUserInformations model object into JSON API data', () => {
      // given
      const organizationUserInformations = new OrganizationUserInformations({
        id: 5,
        currentOrganization: {
          id: 10293,
          name: 'The name of the organization',
          type: 'SUP',
          code: 'WASABI666',
          externalId: 'EXTID'
        },
      });

      const expectedSerializedOrganizationUserInformations = {
        data: {
          type: 'organizationUserInformations',
          id: '5',
          attributes: {},
          relationships: {
            organization: {
              data:
                {
                  type: 'organizations', id: '10293'
                },
            },
            user: {
              'data': null
            }
          }
        },
        included: [{
          type: 'organizations',
          id: '10293',
          attributes: {
            name: 'The name of the organization',
            type: 'SUP',
            code: 'WASABI666',
            'external-id': 'EXTID'
          },
          relationships: {
            campaigns: {
              links: {
                related: '/api/organizations/10293/campaigns'
              }
            },
            'target-profiles': {
              links: {
                related: '/api/organizations/10293/target-profiles'
              }
            },
            memberships: {
              links: {
                related: '/api/organizations/10293/memberships'
              }
            },
            students: {
              links: {
                related: '/api/organizations/10293/students'
              }
            },
            'organization-invitations': {
              links: {
                related: '/api/organizations/10293/invitations',
              },
            },
          }
        }]
      };

      // when
      const json = serializer.serialize(organizationUserInformations);

      // then
      expect(json).to.deep.equal(expectedSerializedOrganizationUserInformations);
    });

    it('should include "organization"', () => {
      // given
      const OrganizationUserInformations = domainBuilder.buildOrganizationUserInformations();

      // when
      const json = serializer.serialize(OrganizationUserInformations);

      // then
      expect(json.data.relationships.organization.data.type).to.equal('organizations');
      expect(json.data.relationships.organization.data.id).to.equal(`${OrganizationUserInformations.organization.id}`);
      expect(json.included[0].type).to.equal('organizations');
      expect(json.included[0].attributes).to.deep.equal({
        'name': 'ACME',
        'type': 'PRO',
        'code': 'ABCD12',
        'external-id': 'EXTID',
        'is-managing-students': false
      });
    });

    it('should include "user"', () => {
      // given
      const OrganizationUserInformations = domainBuilder.buildOrganizationUserInformations();

      // when
      const json = serializer.serialize(OrganizationUserInformations);

      // then
      expect(json.data.relationships.user.data.type).to.equal('users');
      expect(json.data.relationships.user.data.id).to.equal(`${OrganizationUserInformations.user.id}`);
      expect(json.included[1].type).to.equal('users');
      expect(json.included[1].attributes).to.deep.equal({
        'first-name': 'Jean',
        'last-name': 'Dupont',
        'email': 'jean.dupont@example.net',
      });
    });

    it('should not force the add of campaigns and target profiles relation links if the OrganizationUserInformations does not contain organization data', () => {
      // given
      const OrganizationUserInformations = domainBuilder.buildOrganizationUserInformations();
      OrganizationUserInformations.currentOrganization = null;

      // when
      const json = serializer.serialize(OrganizationUserInformations);

      // then
      expect(json.data.relationships.organization.data).to.be.null;
    });
  });
});
