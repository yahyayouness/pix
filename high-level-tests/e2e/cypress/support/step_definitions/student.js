when(`j'accède à la liste des élèves`, () => {
  cy.visitOrga(`/eleves`);
});

then(`je vois la liste des élèves`, () => {
  cy.get('.list-students-page table tbody tr').should('have.lengthOf', 1);
  cy.get('.list-students-page table tbody tr td:nth-child(4)').contains('Mail');
});
