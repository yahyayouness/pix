// https://bookshelfjs.org/
// https://knexjs.org/

const {
  sinon,
  expect,
  databaseBuilder,
} = require('../test-helper');

afterEach(function() {
  sinon.restore();
});

const BookshelfUser = require('../../lib/infrastructure/data/user');
const BookshelfCampaign = require('../../lib/infrastructure/data/campaign');
const BookshelfOrganization = require('../../lib/infrastructure/data/organization');

const {
  buildUser,
  buildOrganization,
  buildTargetProfile,
  buildCampaign,
} = databaseBuilder.factory;

describe('Docs | bookshelf and knex', () => {
  before(async () => {
    await _buildScenario();
  });
  after(async () => {
    await databaseBuilder.clean();
  });
  describe('when requesting a random object', () => {
    it('should fetch any object', async () => {
      const res = await BookshelfUser.where({}).fetch();
      expect(res.attributes.firstName).to.exist;
    });
  });
  describe('when requesting an object by property', () => {
    it('should fetch the correct object(s)', async () => {
      const res = await BookshelfUser.where({ id: 1 }).fetch();
      expect(res.attributes.firstName).to.equal('Michel');
    });
  });
  describe('when fetching one has-one relationship, one level deep', () => {
    it('should fetch the correct object(s)', async () => {
      const res = await BookshelfCampaign
        .where({ id: 1 })
        .fetch({
          withRelated: 'organization'
        });

      expect(res.relations.organization).to.exist;
    });
  });
  describe('when fetching multiple has-one relationships, one level deep', () => {
    it('should fetch the correct object(s)', async () => {
      const res = await BookshelfCampaign
        .where({ id: 1 })
        .fetch({
          withRelated: ['organization', 'targetProfile'],
        });

      expect(res.relations.organization).to.exist;
      expect(res.relations.targetProfile).to.exist;
    });
  });
  describe('when fetching one has-many relationships, one level deep', () => {
    it('should fetch the correct object(s)', async () => {
      const res = await BookshelfOrganization
        .where({ id: 1 })
        .fetch({
          withRelated: 'campaigns',
        });

      expect(res.relations.campaigns.models).to.be.instanceOf(Array);
    });
  });
  describe('when fetching with the through relationship', () => {
    it('should fetch the correct object(s)', async () => {
    });
  });
  describe('when fetching multiple mixed relationships, many levels deep', () => {
    it('should fetch the correct object(s)', async () => {
    });
  });
  describe('when fetching using time-based query', () => {
    it('should fetch the correct object(s)', async () => {
    });
  });
  describe('when fetching by page', () => {
    it('should fetch the correct object(s)', async () => {
    });
  });
  describe('when fetching by defining models that dont match the database', () => {
    it('should fetch the correct object(s)', async () => {
    });
  });
});

async function _buildScenario() {

  buildUser({ id: 1, firstName: 'Michel', lastName: 'Essentiel' });
  buildUser({ id: 2, firstName: 'Thierry', lastName: 'Cherry' });
  buildOrganization({ id: 1, name: 'OCTO Technology', type: 'PRO' });
  buildTargetProfile({ id: 1, organizationId: 1, name: 'Référendum citoyen' });
  buildCampaign({ id: 1, organizationId: 1, targetProfileId: 1, name: 'Démocratie liquide', code: 'DL123' });
  buildCampaign({ id: 2, organizationId: 1, targetProfileId: 1, name: 'L\'État social', code: 'ES456' });

  await databaseBuilder.commit();
}
