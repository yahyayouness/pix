import Model, { hasMany, attr } from '@ember-data/model';

export default class User extends Model {

  @attr() firstName;
  @attr() lastName;
  @attr() email;
  @attr() username;
  @attr() samlId;

  @hasMany('membership') memberships;
}
