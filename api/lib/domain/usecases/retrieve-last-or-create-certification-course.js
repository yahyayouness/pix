const _ = require('lodash');

const CertificationCourse = require('../models/CertificationCourse');
const UserCompetence = require('../models/UserCompetence');
const { UserNotAuthorizedToCertifyError } = require('../errors');

function _selectProfileToCertify(userCompetencesProfileV1, userCompetencesProfileV2) {
  return _([userCompetencesProfileV1, userCompetencesProfileV2])
    .filter(UserCompetence.isListOfUserCompetencesCertifiable)
    .maxBy(UserCompetence.sumPixScores);
}

async function _startNewCertification({
  userId,
  sessionId,
  isCertificationV2Active,
  userService,
  certificationChallengesService,
  certificationCourseRepository
}) {

  const userCompetencesProfileV1 = await userService.getProfileToCertifyV1(userId, new Date());

  let userCompetencesProfileV2;
  if (isCertificationV2Active) {
    userCompetencesProfileV2 = await userService.getProfileToCertifyV2(userId, new Date());
  }
  else {
    userCompetencesProfileV2 = [];
  }

  const userCompetencesToCertify = _selectProfileToCertify(userCompetencesProfileV1, userCompetencesProfileV2);
  if (!userCompetencesToCertify) {
    throw new UserNotAuthorizedToCertifyError();
  }

  const isV2Certification = userCompetencesToCertify === userCompetencesProfileV2;

  const newCertificationCourse = new CertificationCourse({ userId, sessionId, isV2Certification });
  const savedCertificationCourse = await certificationCourseRepository.save(newCertificationCourse);
  return certificationChallengesService.saveChallenges(userCompetencesToCertify, savedCertificationCourse);
}

module.exports = async function retrieveLastOrCreateCertificationCourse({
  accessCode,
  userId,
  settings,
  sessionService,
  userService,
  certificationChallengesService,
  certificationCourseRepository
}) {
  const sessionId = await sessionService.sessionExists(accessCode);
  const certificationCourses = await certificationCourseRepository.findLastCertificationCourseByUserIdAndSessionId(userId, sessionId);

  if (_.size(certificationCourses) > 0) {
    return { created: false, certificationCourse: certificationCourses[0] };
  } else {
    const isCertificationV2Active = settings.features.isCertificationV2Active;
    const certificationCourse = await _startNewCertification({
      userId,
      sessionId,
      isCertificationV2Active,
      userService,
      certificationChallengesService,
      certificationCourseRepository
    });
    return { created: true, certificationCourse };
  }
};
