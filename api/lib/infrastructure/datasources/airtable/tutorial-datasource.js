const airtable = require('../../airtable');
const airTableDataObjects = require('./objects');

const AIRTABLE_TABLE_NAME = 'Tutoriels';

module.exports = {
  get(id) {
    return airtable.getRecord(AIRTABLE_TABLE_NAME, id)
      .then((airtableRawObject) => airTableDataObjects.Tutorial.fromAirTableObject(airtableRawObject));
  },

  list() {
    return airtable.findRecords(AIRTABLE_TABLE_NAME, {})
      .then((airtableRawObjects) => airtableRawObjects.map(airTableDataObjects.Tutorial.fromAirTableObject));
  },
};

