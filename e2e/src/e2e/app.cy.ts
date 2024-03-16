describe('e2e', () => {
  beforeEach(() => cy.visit('/'));

  it.skip('should display welcome message', () => {
    cy.get('h1').contains(/Users/);
  });
});
