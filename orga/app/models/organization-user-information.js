import DS from 'ember-data';

export default DS.Model.extend({
  organization: DS.belongsTo('organization'),
  user: DS.belongsTo('user')
});
