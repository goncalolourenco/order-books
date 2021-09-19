describe('Order book test cases', () => {
  const checkIfTableHasValues = () =>
    cy.findAllByRole('table').each((table) => {
      cy.findAllByRole('row', { container: table })
        .should('have.length', 21)
        .each((row, index) => {
          if (index !== 0) {
            cy.findAllByRole('cell', { container: row }).should('have.length', 3);
          }
        });
    });

  it('order page loads orders for bitcoin when we enter', () => {
    cy.visit('/');

    cy.findByText('Loading orders...').should('exist');
    cy.findByText('Order Books PI_XBTUSD').should('exist');

    checkIfTableHasValues();
  });

  it('order page toggle button changes to ETH', () => {
    cy.visit('/');

    cy.findByText('Loading orders...').should('exist');
    cy.findByText('Order Books PI_XBTUSD').should('exist');

    cy.findByText('Toggle feed').click();
    cy.findByText('Order Books PI_ETHUSD').should('exist');

    checkIfTableHasValues();
  });

  it('when page loses focus, try to reconnect to get orders', () => {
    cy.visit('/');

    cy.findByText('Loading orders...').should('exist');
    cy.findByText('Order Books PI_XBTUSD').should('exist');

    cy.window().trigger('blur');
    cy.findByText('Reconnect').click({ force: true });

    cy.wait(5000);
    checkIfTableHasValues();
  });
});

export {};
