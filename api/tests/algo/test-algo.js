const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');
require('dotenv').config({ path: '../../.env' });

const skillRepository = require('../../lib/infrastructure/repositories/skill-repository');
const challengeRepository = require('../../lib/infrastructure/repositories/challenge-repository');
const smartRandom = require('../../lib/domain/services/smart-random/smart-random');

const AnswerModel = require('../../lib/domain/models/Answer');
const KeModel = require('../../lib/domain/models/KnowledgeElement');
const possibleResults = ['ok', 'ko'];

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

function _selectUserResponse(mode, nextChallenge, numberOfChallengeAsked) {
  let response;
  switch (mode) {
    case 'FULLOK':
      response = possibleResults[0];
      break;
    case 'KOFULLOK':
      response = numberOfChallengeAsked===1 ? possibleResults[1] : possibleResults[0];
      break;
    case 'FULLKO':
      response = possibleResults[1];
      break;
    case 'OKFULLKO':
      response = numberOfChallengeAsked===1 ? possibleResults[0] : possibleResults[1];
      break;
    case 'RANDOM':
      response = possibleResults[Math.round(Math.random())];
      break;
    case 'USER':
      const userData = require('./user.json');
      const userKEForSkill = userData.filter(userKE => userKE.skillId === nextChallenge.skills[0].id);
      if(userKEForSkill.length > 0) {
        console.log('user');
       response = userKEForSkill[0].status === 'validated' ? possibleResults[0] : possibleResults[1];
      } else {
        console.log('random');
        response = possibleResults[Math.round(Math.random())];
      }
      break;
  }
  return response;
}

async function _launchSimulation(mode, competenceId) {

  let numberOfChallengeAsked = 0;
  let result = [];

  let userKnowledgeElements = [];
  let responseOfAlgo;
  let lastAnswer = null;

  const [
    targetSkills,
    challenges,

  ] = await Promise.all([
    skillRepository.findByCompetenceId(competenceId),
    challengeRepository.findByCompetenceId(competenceId),
  ]);

  do {

    responseOfAlgo = smartRandom.getNextChallenge({ answers: [lastAnswer], targetSkills, challenges, knowledgeElements: userKnowledgeElements });

    if (!responseOfAlgo.nextChallenge) {
      console.log('FINISHED WITH', numberOfChallengeAsked);
      break;
    } else {
      numberOfChallengeAsked++;
    }

    const response = _selectUserResponse(mode, responseOfAlgo.nextChallenge, numberOfChallengeAsked);
    lastAnswer = new AnswerModel({ result: response, challengeId: responseOfAlgo.nextChallenge.id });

    result.push({
      numberOfChallenge: numberOfChallengeAsked,
      tube: responseOfAlgo.nextChallenge.skills[0].tubeName,
      levelOfChallenge: responseOfAlgo.nextChallenge.skills[0].difficulty,
      estimatedLevel: responseOfAlgo.levelEstimated,
      responseOfUser: response === possibleResults[0] ? 1 : 0
    });

    const temp = KeModel.createKnowledgeElementsForAnswer({
      answer: lastAnswer,
      challenge: responseOfAlgo.nextChallenge,
      previouslyFailedSkills: [],
      previouslyValidatedSkills: [],
      targetSkills,
      userId: 1
    });

    userKnowledgeElements = _.union(userKnowledgeElements, temp);

  } while (!responseOfAlgo.hasAssessmentEnded);

  return result;

}

function _createJsonResult({ result, competenceId, mode }) {
  const fileName = `test_${competenceId}_${mode}_${moment().format('YYYYMMDDhhmm')}.json`;
  console.log(result);
  const data = JSON.stringify(result);
  return fs.writeFileSync(fileName, data);
}

async function main() {
  const { mode, competenceId } = _selectMode(process.argv);

  console.log('Test sur la compétence ', competenceId);
  console.log('En mode ', mode);
  const result = await _launchSimulation(mode, competenceId);
  return _createJsonResult({ result, mode, competenceId});
}


main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
