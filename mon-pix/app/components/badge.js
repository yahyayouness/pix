import Component from '@ember/component';

const badgesDirectory = '/badges';
const badgeIdToUrlMap = {
  'pixjob': {
    path: `${badgesDirectory}/Pix-emploi.svg`,
    alternativeText: 'Vous avez validé le badge Pix Emploi.'
  },
  'cleanum': {
    path: `${badgesDirectory}/Pret-CleaNum.svg`,
    alternativeText: 'Vous avez validé le badge Cléa Numérique.'
  },
};

export default Component.extend({
  tagName: '',
  badgePicture: null,
  badgeId: null,

  init() {
    debugger;
    this._super(...arguments);
    this.set('badgePicture', badgeIdToUrlMap[this.badgeId]);
  }
});
