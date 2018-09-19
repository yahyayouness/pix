#! /usr/bin/env node

require('dotenv').config();

const dataSources = {
  areas: require('../lib/infrastructure/datasources/airtable/area-datasource'),
  challenges: require('../lib/infrastructure/datasources/airtable/challenge-datasource'),
  competences: require('../lib/infrastructure/datasources/airtable/competence-datasource'),
  skills: require('../lib/infrastructure/datasources/airtable/skill-datasource'),
  tutorials: require('../lib/infrastructure/datasources/airtable/tutorial-datasource'),
}

function main(args) {
  const keys = Object.keys(dataSources);
  Promise.all(keys.map((key) => dataSources[key].list()))
  .then((lists) => {
    const data = { };
    lists.forEach((list, index) => {
      data[keys[index]] = list;
    });
    console.log(JSON.stringify(data));
  })
  .catch(console.error);
}

main(process.argv);

