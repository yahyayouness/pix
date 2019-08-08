const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');
require('dotenv').config({ path: '../../.env' });

const skillRepository = require('../../lib/infrastructure/repositories/skill-repository');
const challengeRepository = require('../../lib/infrastructure/repositories/challenge-repository');
const users = require('./users.json');


function _selectMode(argv) {
  let mode='random', competenceId='';
  _.each(argv, (argument) => {
    if(argument.split('=')[0] === 'MODE'){
      mode = argument.split('=')[1];
    }
    if(argument.split('=')[0] === 'COMPETENCE'){
      competenceId = argument.split('=')[1];
    }
  });
  return { mode, competenceId };
}

function _createJsonResult({ result, nameFile }) {
  const data = JSON.stringify(result);
  return fs.writeFileSync(nameFile, data);
}

function _cleanChallenge(challenges) {
  return _.each(challenges, (challenge) => {
    delete challenge.instruction;
    delete challenge.proposals;
    delete challenge.validator;
    delete challenge.illustrationUrl;
  });
}

function _cryptChallenge(challenges) {

}
async function main() {
  const { mode, competenceId } = _selectMode(process.argv);

  let [
    targetSkills,
    challenges,

  ] = await Promise.all([
    skillRepository.findByCompetenceId(competenceId),
    challengeRepository.findByCompetenceId(competenceId),
  ]);
  challenges = _cleanChallenge(challenges);
  _createJsonResult({ result: targetSkills, nameFile: "skills.json" });
  _createJsonResult({ result: challenges, nameFile: "challenges.json"});

  const knowledgeElementsByUser = _.groupBy(users, 'userId');
  const usersInformations = _.map(knowledgeElementsByUser, (knowledgeElementsForOneUser, key) => {
    knowledgeElementsForOneUser = _.forEach(knowledgeElementsForOneUser, (ke) => delete ke.userId);
    return { userId: key, knowledgeElements: knowledgeElementsForOneUser };
  });
  _createJsonResult({ result: usersInformations, nameFile: "usersExample.json"});

  return null;
}


main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
