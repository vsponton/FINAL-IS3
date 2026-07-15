describe('Gestor de Libros - E2E', () => {
  it('lista, agrega y navega', () => {
    cy.intercept('GET', '**/api/books*').as('getBooks');
    cy.intercept('POST', '**/api/books').as('createBook');

    cy.visit('/');
    cy.wait('@getBooks');

    cy.contains('Gestor de Libros').should('be.visible');

    cy.get('[data-cy="book-title"]').type('Libro E2E');
    cy.get('[data-cy="book-author"]').type('Autor E2E');
    cy.get('[data-cy="book-year"]').type('2024');
    cy.get('[data-cy="book-price"]').type('15000');
    cy.get('[data-cy="book-submit"]').click();

    cy.wait('@createBook').its('response.statusCode').should('be.oneOf', [200, 201]);

    cy.contains('Libro E2E').should('be.visible');

    cy.contains('Ventas').click();
    cy.contains('Comprador').should('be.visible');
  });
});
