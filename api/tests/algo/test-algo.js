const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');
require('dotenv').config({ path: '../../.env' });
const skills = require('./skills.json');
const challengesFromReferential = require('./challenges.json');
const users = require('./usersExample.json');

const smartRandom = require('./pixAlgorithm/smart-random');
const AnswerModel = require('./pixAlgorithm/AnswerModel');
const ChallengeModel = require('./pixAlgorithm/ChallengeModel');
const SkillModel = require('./pixAlgorithm/SkillModel');
const KeModel = require('./pixAlgorithm/KnowledgeElementModel');

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

function _selectUserResponse(mode, nextChallenge, numberOfChallengeAsked, usersInformations) {
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
      const userKEForSkill = usersInformations.filter(userKE => userKE.skillId === nextChallenge.skills[0].id);
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

function _getReferential(competenceId) {
  let targetSkills = _.filter(skills, (skill) => skill.competenceId === competenceId);
  let challenges = _.filter(challengesFromReferential, (challenge) => challenge.competenceId === competenceId);
  targetSkills = _.map(targetSkills, (skill) => new SkillModel(skill));
  challenges = _.map(challenges, (challenge) => {
    challenge.skills = _.map(challenge.skills, (skill) => new SkillModel(skill));
    return new ChallengeModel(challenge)
  });
  return { targetSkills, challenges };

}
async function _launchSimulation(mode, competenceId) {

  let numberOfChallengeAsked = 0;
  let result = [];
  let userKnowledgeElements = [];
  let responseOfAlgo;
  let lastAnswer = null;
  let usersInformations;
  if(mode === 'USER') {
    const userFind = users[Math.floor(Math.random() * users.length)];
    usersInformations = userFind.knowledgeElements;
  }

  const { targetSkills, challenges } = _getReferential(competenceId);

  do {

    responseOfAlgo = smartRandom.getNextChallenge({ answers: [lastAnswer], targetSkills, challenges, knowledgeElements: userKnowledgeElements });

    if (!responseOfAlgo.nextChallenge) {
      console.log('FINISHED WITH', numberOfChallengeAsked);
      break;
    } else {
      numberOfChallengeAsked++;
    }

    const response = _selectUserResponse(mode, responseOfAlgo.nextChallenge, numberOfChallengeAsked, usersInformations);
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
