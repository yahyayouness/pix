const _ = require('lodash');

const skillRepository = require('../../lib/infrastructure/repositories/skill-repository');
const challengeRepository = require('../../lib/infrastructure/repositories/challenge-repository');
const smartRandom = require('../../lib/domain/services/smart-random/smart-random');

const AnswerModel = require('../../lib/domain/models/Answer');
const KeModel = require('../../lib/domain/models/KnowledgeElement');

const competenceId = 'rece6jYwH4WEw549z';

async function main() {
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
  let result = smartRandom.getNextChallenge({ answers, targetSkills, challenges, knowledgeElements });
  console.log(result.nextChallenge.skills[0].name);

  while (!result.hasAssessmentEnded) {

    const lastAnswer = new AnswerModel({ result: 'ok', challengeId: result.nextChallenge.id });


    const temp = KeModel.createKnowledgeElementsForAnswer({
      answer: lastAnswer,
      challenge: result.nextChallenge,
      previouslyFailedSkills: [],
      previouslyValidatedSkills: [],
      targetSkills,
      userId: 1
    });

    ke = _.union(ke, temp);

    result = smartRandom.getNextChallenge({ answers: [lastAnswer], targetSkills, challenges, knowledgeElements: ke });
    console.log(result.nextChallenge.skills[0].name);
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
