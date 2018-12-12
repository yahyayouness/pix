const _ = require('lodash');
const moment = require('moment');

const UserCompetence = require('../../../lib/domain/models/UserCompetence');
const CertificationCourse = require('../../../lib/domain/models/CertificationCourse');
const { UserNotAuthorizedToCertifyError } = require('../../../lib/domain/errors');

module.exports = function getProfileToCertify(
  {
    userId,
    sessionId,
    onlyGetProfileToCertify,
    assessmentRepository,
    challengeRepository,
    answerRepository,
    competenceRepository,
    courseRepository,
    certificationCourseRepository,
    certificationChallengesService
  })  {
  const limitDate = moment().toISOString();

  if(onlyGetProfileToCertify) {
    return _getProfileToCertify({ userId, limitDate,
      assessmentRepository,
      challengeRepository,
      answerRepository,
      competenceRepository,
      courseRepository
    });
  }

  let userCompetencesToCertify;
  const newCertificationCourse = new CertificationCourse({ userId, sessionId });
  return _getProfileToCertify({ userId, limitDate,
    assessmentRepository,
    challengeRepository,
    answerRepository,
    competenceRepository,
    courseRepository
  })
    .then((userCompetences) => {
      userCompetencesToCertify = userCompetences;
      return _checkIfUserCanStartACertification(userCompetences);
    })
    .then(() => certificationCourseRepository.save(newCertificationCourse))
    .then((savedCertificationCourse) => certificationChallengesService.saveChallenges(userCompetencesToCertify, savedCertificationCourse));
};

function _checkIfUserCanStartACertification(userCompetences) {
  const nbCompetencesWithEstimatedLevelHigherThan0 = userCompetences
    .filter((competence) => competence.estimatedLevel > 0)
    .length;

  if (nbCompetencesWithEstimatedLevelHigherThan0 < 5)
    throw new UserNotAuthorizedToCertifyError();
}

function _getProfileToCertify(
  {
    userId,
    limitDate,
    assessmentRepository,
    challengeRepository,
    answerRepository,
    competenceRepository,
    courseRepository
  }) {

  let coursesFromAdaptativeCourses;
  let userLastAssessments;
  return courseRepository.getAdaptiveCourses() // COMMENT-254 : Utilité de ça vu qu'on récupère les compétences + bas ?
    .then((courses) => {
      coursesFromAdaptativeCourses = courses;   // COMMENT-254 : Récupération de toutes les compétences
      return assessmentRepository.findLastCompletedAssessmentsForEachCoursesByUser(userId, limitDate);
    })
    .then((lastAssessments) => {
      userLastAssessments = lastAssessments; // COMMENT-254 : Récupération des derniers positionnements terminés de l'utilisateurs
      return _filterAssessmentWithEstimatedLevelGreaterThanZero(lastAssessments); // COMMENT-254 : Les filtres pour n'avoir que les compétences de niveau >1
      // COMMENT-254 : Un bon endroit pour arreter s'il n'y a pas assez d'assessment
    })
    .then((assessments) => _findCorrectAnswersByAssessments(assessments, answerRepository)) // COMMENT-254 : Récupère les réponses de ces assessments (pour savoir quoi poser comme question)
    .then((answers) => _loadRequiredChallengesInformationsAndAnswers(answers, challengeRepository, competenceRepository)) // COMMENT-254 : Récupère tous les challenges, les compétences et les answers
    .then(_castCompetencesToUserCompetences)// COMMENT-254 : Passe les compétences en UserCompetence object
    .then(([challenges, userCompetences, answers]) => {
      // COMMENT-254 : C'est ici que se passe les choses
      // COMMENT-254 : Pour chaque answers, récupérer son challenge, la compétence testé, et ajouter s'il existe encore l'acquis à la compétence
      answers.forEach((answer) => {
        const challenge = _getRelatedChallengeById(challenges, answer);
        const competence = _getCompetenceByChallengeCompetenceId(userCompetences, challenge);

        if (challenge && competence) {
          challenge.skills
            .filter((skill) => _skillHasAtLeastOneChallengeInTheReferentiel(skill, challenges))
            .forEach((publishedSkill) => competence.addSkill(publishedSkill));
        }
      });

      // COMMENT-254 : Limiter aux trois acquis les plus élevé /!\ ICI QUE LON DOIT CHANGER DES CHOSES
      userCompetences = _limitSkillsToTheThreeHighestOrderedByDifficultyDesc(userCompetences);

      // COMMENT-254 : récupérer les épreuves auxquelles ont a déjà répondu
      const challengeIdsAlreadyAnswered = answers.map((answer) => answer.get('challengeId'));
      const challengesAlreadyAnswered = challengeIdsAlreadyAnswered.map((challengeId) => _getChallengeById(challenges, challengeId));

      // COMMENT-254 : Ajout des compétences avec le niveau à testé en compétences
      userCompetences = _addCourseIdAndPixToCompetence(userCompetences, coursesFromAdaptativeCourses, userLastAssessments);

      // COMMENT-254 : Choix des questions pour chaque compétences /!\ ICI QUE LON DOIT CHANGER DES CHOSES
      userCompetences.forEach((userCompetence) => {
        userCompetence.skills.forEach((skill) => {
          const challengesToValidateCurrentSkill = _findChallengeBySkill(challenges, skill);
          const challengesLeftToAnswer = _.difference(challengesToValidateCurrentSkill, challengesAlreadyAnswered);

          const challenge = (_.isEmpty(challengesLeftToAnswer)) ? _.first(challengesToValidateCurrentSkill) : _.first(challengesLeftToAnswer);

          //TODO : Mettre le skill en entier (Skill{id, name})
          challenge.testedSkill = skill.name;

          userCompetence.addChallenge(challenge);
        });
      });

      return userCompetences;
    });
}

function _findCorrectAnswersByAssessments(assessments, answerRepository) {

  const answersByAssessmentsPromises = assessments.map((assessment) => answerRepository.findCorrectAnswersByAssessment(assessment.id));

  return Promise.all(answersByAssessmentsPromises)
    .then((answersByAssessments) => {
      return answersByAssessments.reduce((answersInJSON, answersByAssessment) => {
        answersByAssessment.models.forEach((answer) => {
          answersInJSON.push(answer);
        });
        return answersInJSON;
      }, []);
    });
}

function _getCompetenceByChallengeCompetenceId(competences, challenge) {
  return challenge ? competences.find((competence) => competence.id === challenge.competenceId) : null;
}

function _loadRequiredChallengesInformationsAndAnswers(answers, challengeRepository, competenceRepository) {
  return Promise.all([
    challengeRepository.list(), competenceRepository.list(), answers,
  ]);
}

function _castCompetencesToUserCompetences([challenges, competences, answers]) {
  competences = competences.reduce((result, value) => {
    result.push(new UserCompetence(value));
    return result;
  }, []);

  return [challenges, competences, answers];
}

function _findChallengeBySkill(challenges, skill) {
  return _(challenges).filter((challenge) => {
    return challenge.hasSkill(skill) && challenge.isPublished();
  }).value();
}

function _skillHasAtLeastOneChallengeInTheReferentiel(skill, challenges) {
  const challengesBySkill = _findChallengeBySkill(challenges, skill);
  return challengesBySkill.length > 0;
}

function _addCourseIdAndPixToCompetence(competences, courses, assessments) {
  competences.forEach((competence) => {
    const currentCourse = courses.find((course) => course.competences[0] === competence.id);
    const assessment = assessments.find((assessment) => currentCourse.id === assessment.courseId);
    if (assessment) {
      competence.pixScore = assessment.getPixScore();
      competence.estimatedLevel = assessment.getLevel();
    } else {
      competence.pixScore = 0;
      competence.estimatedLevel = 0;
    }
  });

  return competences;
}

function _sortThreeMostDifficultSkillsInDesc(skills) {
  return _(skills)
    .sortBy('difficulty')
    .reverse()
    .take(3)
    .value();
}

function _limitSkillsToTheThreeHighestOrderedByDifficultyDesc(competences) {
  competences.forEach((competence) => {
    competence.skills = _sortThreeMostDifficultSkillsInDesc(competence.skills);
  });
  return competences;
}

function _getRelatedChallengeById(challenges, answer) {
  return challenges.find((challenge) => challenge.id === answer.get('challengeId'));
}

function _getChallengeById(challenges, challengeId) {
  return _(challenges).find((challenge) => challenge.id === challengeId);
}

function _filterAssessmentWithEstimatedLevelGreaterThanZero(assessments) {
  return _.filter(assessments,(assessment) => assessment.getLastAssessmentResult().level >= 1);
}
