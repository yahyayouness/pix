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

  const [
    answers,
    targetSkills,
    challenges,
    knowledgeElements

  ] = await Promise.all([
    [],
    skillRepository.findByCompetenceId(competenceId),
    challengeRepository.findByCompetenceId(competenceId),
    []
  ]);
  let ke = [];
  let result;
  let lastAnswer;
  console.log('Niveau de lepreuve;Niveau estime qui a aidé a la question;Ce quil a repondu;');

  do {

    result = smartRandom.getNextChallenge({ answers: [lastAnswer], targetSkills, challenges, knowledgeElements: ke });

    if (!result.nextChallenge) {
      console.log('the end', questionsCount);
      break;
    } else {
      questionsCount++;
    }

    let response;
    switch (mode) {
      case 'fullOk':
        response = 'ok';
        break;
      case 'fullKo':
        response = 'ko';
        break;
      case 'random':
        response = possibleResults[Math.round(Math.random())];
        break;
      case 'user':
        const userData = require('./data.json');
        const keForSkill = userData.filter(ke => ke.skillId === result.nextChallenge.skills[0].id);
        response = keForSkill[0].status === 'validated' ? 'ok' : 'ko';
        break;
    }

    lastAnswer = new AnswerModel({ result: response, challengeId: result.nextChallenge.id });
    questionLevels.push(result.nextChallenge.skills[0].difficulty);
    responseResults.push(response === 'ok' ? 1 : 0);
    console.log(`${result.nextChallenge.skills[0].tubeName};${result.nextChallenge.skills[0].difficulty}; ${result.levelEstimated}; ${response}`);

    const temp = KeModel.createKnowledgeElementsForAnswer({
      answer: lastAnswer,
      challenge: result.nextChallenge,
      previouslyFailedSkills: [],
      previouslyValidatedSkills: [],
      targetSkills,
      userId: 1
    });

    ke = _.union(ke, temp);

  } while (!result.hasAssessmentEnded)

  return fs.writeFileSync("./api/tests/algo/data.js", `var data = [${questionLevels}];\nvar responses = [${responseResults}];`)
}


main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
