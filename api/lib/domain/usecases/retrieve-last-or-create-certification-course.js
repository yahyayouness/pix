const _ = require('lodash');

const CertificationCourse = require('../models/CertificationCourse');
const UserCompetence = require('../models/UserCompetence');
const { UserNotAuthorizedToCertifyError } = require('../errors');

function _isV1CertificationCourse(
  isCertificationV2Active,
  userCompetencesProfileV1,
  userCompetencesProfileV2
) {
  if (!isCertificationV2Active) {
    return true;
  }
  if (!UserCompetence.isListOfUserCompetencesCertifiable(userCompetencesProfileV1)) {
    return false;
  }
  if (!UserCompetence.isListOfUserCompetencesCertifiable(userCompetencesProfileV2)) {
    return true;
  }
  return UserCompetence.sumPixScores(userCompetencesProfileV1) >= UserCompetence.sumPixScores(userCompetencesProfileV2);
}
async function _startNewCertification({
  userId,
  sessionId,
  isCertificationV2Active,
  userService,
  certificationChallengesService,
  certificationCourseRepository
}) {

  const now = new Date();

  const userCompetencesProfileV1 = await userService.getProfileToCertifyV1(userId, now);
  const userCompetencesProfileV2 = await userService.getProfileToCertifyV2(userId, now);

  const isV1Certification = _isV1CertificationCourse(isCertificationV2Active, userCompetencesProfileV1, userCompetencesProfileV2);
  const isV2Certification = !isV1Certification && UserCompetence.isListOfUserCompetencesCertifiable(userCompetencesProfileV2);

  if (!isV1Certification && !isV2Certification) {
    throw new UserNotAuthorizedToCertifyError();
  }

  const userCompetencesToCertify = isV1Certification ?
    userCompetencesProfileV1 :
    userCompetencesProfileV2;

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
