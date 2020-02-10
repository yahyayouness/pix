const { batch } = require('../batchTreatment');

const TABLE_NAME_ORGANIZATION_USER_INFORMATIONS = 'organization-user-informations';
const TABLE_NAME_MEMBERSHIPS = 'memberships';

exports.up = function(knex) {
  const subQuery = knex(TABLE_NAME_MEMBERSHIPS).min('id').groupBy('userId');

  return knex(TABLE_NAME_MEMBERSHIPS)
    .select('userId', 'organizationId')
    .whereIn('id', subQuery)
    .then((memberships) => {

      return batch(knex, memberships, (membership) => {
        return knex(TABLE_NAME_ORGANIZATION_USER_INFORMATIONS)
          .insert({
            userId: membership.userId,
            currentOrganizationId: membership.organizationId
          });
      });

    })
    .then(() => {
      console.log(`${TABLE_NAME_ORGANIZATION_USER_INFORMATIONS} table was populated!`);
    });
};

exports.down = function(knex) {
  const subQuery = knex(TABLE_NAME_MEMBERSHIPS).min('id').groupBy('userId');

  return knex(TABLE_NAME_MEMBERSHIPS)
    .select('userId', 'organizationId')
    .whereIn('id', subQuery)
    .then((memberships) => {

      return batch(knex, memberships, (membership) => {
        return knex(TABLE_NAME_ORGANIZATION_USER_INFORMATIONS)
          .delete({
            userId: membership.userId,
            currentOrganizationId: membership.organizationId
          });
      });

    })
    .then(() => {
      console.log(`${TABLE_NAME_ORGANIZATION_USER_INFORMATIONS} table was cleaned!`);
    });
};
