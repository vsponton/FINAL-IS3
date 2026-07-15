// frontend/cypress/e2e/books.cy.js
describe("Gestor de Libros – E2E", () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/books*').as('getBooks');
    cy.visit('/');
    cy.wait('@getBooks');

    // Esperar a que se cargue la tabla inicial (primer GET /api/books)
    cy.contains("Gestor de Libros").should("be.visible");
  });

  it("muestra la lista inicial de libros", () => {
    // Aquí solo verificamos que cargó la tabla
    cy.contains("Gestor de Libros").should("be.visible");
  });

  it("permite agregar un libro nuevo", () => {
    cy.intercept('POST', '**/api/books').as('createBook');

    cy.get('[data-cy="book-title"]').type("Libro E2E");
    cy.get('[data-cy="book-author"]').type("Autor E2E");
    cy.get('[data-cy="book-year"]').type("2024");
    cy.get('[data-cy="book-price"]').type("15000");
    cy.get('[data-cy="book-submit"]').click();

    cy.wait('@createBook').its('response.statusCode').should('be.oneOf', [200, 201]);

    cy.contains("Libro E2E").should("be.visible");
    cy.contains("Autor E2E").should("be.visible");
  });

  it("permite editar y borrar un libro", () => {
    cy.intercept('POST', '**/api/books').as('createBook');
    cy.intercept('PUT', '**/api/books/**').as('updateBook');
    cy.intercept('DELETE', '**/api/books/**').as('deleteBook');

    // Crear libro para edición
    cy.get('[data-cy="book-title"]').type("Libro Cypress");
    cy.get('[data-cy="book-author"]').type("Autor Cypress");
    cy.get('[data-cy="book-year"]').type("2025");
    cy.get('[data-cy="book-price"]').type("15000");
    cy.get('[data-cy="book-submit"]').click();

    cy.wait('@createBook').its('response.statusCode').should('be.oneOf', [200, 201]);

    // Editar libro
    cy.contains('[data-cy="book-row"]', "Libro Cypress")
      .within(() => cy.contains("button", "Editar").click());

    cy.get('[data-cy="book-title"]').clear().type("Libro Editado");
    cy.get('[data-cy="book-submit"]').click();

    cy.wait('@updateBook').its('response.statusCode').should('be.oneOf', [200, 201]);

    cy.contains("Libro Editado").should("be.visible");

    // Borrar libro – registrar handler ANTES de hacer click
    cy.on("window:confirm", () => true);
    cy.contains('[data-cy="book-row"]', "Libro Editado")
      .within(() => cy.contains("button", "Borrar").click());

    cy.wait('@deleteBook').its('response.statusCode').should('be.oneOf', [200, 204]);

    cy.contains("Libro Editado").should("not.exist");
  });
});
