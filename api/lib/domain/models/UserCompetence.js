const _ = require('lodash');

class UserCompetence {

  constructor({
    id,
    // attributes
    index,
    name,
    // includes
    // references
  } = {}) {
    this.id = id;
    // attributes
    this.index = index;
    this.name = name;
    // includes
    this.skills = [];
    this.challenges = [];
    // references
  }

  addSkill(newSkill) {
    const hasAlreadySkill = _(this.skills).filter((skill) => skill.name === newSkill.name).size();

    if (!hasAlreadySkill) {
      this.skills.push(newSkill);
    }
  }

  addChallenge(newChallenge) {
    const hasAlreadyChallenge = _(this.challenges).filter((challenge) => challenge.id === newChallenge.id).size();

    if (!hasAlreadyChallenge) {
      this.challenges.push(newChallenge);
    }
  }

  static isListOfUserCompetencesCertifiable(userCompetences) {
    const competencesWithEstimatedLevelHigherThan0 = userCompetences
      .filter((competence) => competence.estimatedLevel > 0);

    return _.size(competencesWithEstimatedLevelHigherThan0) >= 5;
  }

  static sumPixScores(userCompetences) {
    return _.sumBy(userCompetences, 'pixScore');
  }
}

module.exports = UserCompetence;
