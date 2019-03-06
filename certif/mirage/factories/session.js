import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({

  examiner() {
    return faker.company.companyName();
  },

  accessCode() {
    return 'ABCDEF' + faker.random.number({min: 100, max: 999});
  },

  date() {
    return '2019-02-23';
  },

  time() {
    return '14:00:00';
  },

  createdAt() {
    return faker.date.recent();
  },

});
