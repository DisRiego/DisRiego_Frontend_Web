describe("Descarga de Reporte en Gestión de Roles", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/login");

    cy.get('input[name="email"]')
      .should("be.visible")
      .type("gagnekafyi@gufum.com");
    cy.get('input[name="password"]')
      .should("be.visible")
      .type("Contraseña123.");
    cy.get('button[type="submit"]').should("be.enabled").click();

    cy.url().should("include", "/dashboard");
    cy.contains("Gestión de roles").should("be.visible").click();
  });

  it("Debe descargar el reporte correctamente", () => {
    // Interceptar la solicitud de descarga (Asegúrate de que la URL sea la correcta)
    cy.intercept("GET", "/api/reportes/roles").as("descargaReporte");

    // Hacer clic en el botón de descarga
    cy.contains("Descargar reporte").should("be.visible").click();

    // Esperar la solicitud y verificar que la respuesta sea 200
    cy.wait("@descargaReporte").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    // Verificar que el archivo se descargó en la carpeta de descargas
    const filePath = Cypress.config("downloadsFolder") + "/reporte_roles.pdf";
    cy.readFile(filePath).should("exist");
  });
});
