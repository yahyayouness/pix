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
