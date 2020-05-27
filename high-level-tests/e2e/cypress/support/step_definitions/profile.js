when(`je clique sur le rond de niveau de la compétence {string}`, (competenceName) => {
  cy.contains('.competence-card', competenceName).find('.competence-card__link').click();
});

when(`je survole la carte {string}`, (scorecardName) => {
  cy.contains('.competence-card', scorecardName).invoke('trigger', 'mouseover');
});

then(`je vois la page de détails de la compétence {string}`, (competenceName) => {
  cy.get('.competence-details').should('contain', competenceName);
});

then(`je vois un score de {string} pour la carte {string}`, (value, scorecardName) => {
  cy.contains('.competence-card', scorecardName).find('.score-value')
    .should('contain', value);
});

then(`je vois le nombre de Pix de la compétence à {string}`, (value) => {
  cy.get('.score-value').should('contain', value);
});

then(`je vois le nombre de Pix restant avant le prochain niveau à {string}`, (value) => {
  cy.get('.scorecard-details-content-right__level-info').should('contain', value);
});

then(`je vois que je peux reset la compétence dans {string} jours`, (value) => {
  cy.get('.scorecard-details-content-right__reset-message').should('contain', value);
});
