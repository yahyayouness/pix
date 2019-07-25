const fs = require('fs');
const _ = require('lodash');

const skillRepository = require('../../lib/infrastructure/repositories/skill-repository');
const challengeRepository = require('../../lib/infrastructure/repositories/challenge-repository');
const smartRandom = require('../../lib/domain/services/smart-random/smart-random');

const AnswerModel = require('../../lib/domain/models/Answer');
const KeModel = require('../../lib/domain/models/KnowledgeElement');

const competenceId = 'rece6jYwH4WEw549z';

async function main() {
  let mode = process.argv[2].split('=')[1];
  let questionsCount = 0;
  const possibleResults = ['ok', 'ko'];
  let questionLevels = [];
  let responseResults = [];
  let estimatedLevelResults = [];
  let userKE = [];
  let result;
  let lastAnswer = null;
  console.log('Test sur la compétence ', competenceId);
  console.log('En mode ', mode);
  console.log('Tube; Niveau de lepreuve;Niveau estime qui a aidé a la question;Ce quil a repondu;');

  const [
    targetSkills,
    challenges,

  ] = await Promise.all([
    skillRepository.findByCompetenceId(competenceId),
    challengeRepository.findByCompetenceId(competenceId),
  ]);


  do {

    result = smartRandom.getNextChallenge({ answers: [lastAnswer], targetSkills, challenges, knowledgeElements: userKE });

    if (!result.nextChallenge) {
      console.log('the end', questionsCount);
      break;
    } else {
      questionsCount++;
    }

    let response;
    switch (mode) {
      case 'fullOk':
        response = possibleResults[0];
        break;
      case 'fullKo':
        response = possibleResults[1];
        break;
      case 'random':
        response = possibleResults[Math.round(Math.random())];
        break;
      case 'user':
        const userData = require('./data.json');
        const userKEForSkill = userData.filter(userKE => userKE.skillId === result.nextChallenge.skills[0].id);
        response = userKEForSkill[0].status === 'validated' ? possibleResults[0] : possibleResults[1];
        break;
    }

    lastAnswer = new AnswerModel({ result: response, challengeId: result.nextChallenge.id });
    questionLevels.push(result.nextChallenge.skills[0].difficulty);
    estimatedLevelResults.push(result.levelEstimated);
    responseResults.push(response === possibleResults[0] ? 1 : 0);

    console.log(`${result.nextChallenge.skills[0].tubeName};${result.nextChallenge.skills[0].difficulty}; ${result.levelEstimated}; ${response}`);

    const temp = KeModel.createKnowledgeElementsForAnswer({
      answer: lastAnswer,
      challenge: result.nextChallenge,
      previouslyFailedSkills: [],
      previouslyValidatedSkills: [],
      targetSkills,
      userId: 1
    });

    userKE = _.union(userKE, temp);

  } while (!result.hasAssessmentEnded)

  return fs.writeFileSync("./api/tests/algo/data.js", `var data = [${questionLevels}];\nvar responses = [${responseResults}];\nvar estimated = [${estimatedLevelResults}];`)
}


main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
