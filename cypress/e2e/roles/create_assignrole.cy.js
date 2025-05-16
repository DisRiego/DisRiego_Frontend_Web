describe("Gestión de Roles", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/login");

    // Asegura que los inputs estén visibles antes de escribir
    cy.get('input[name="email"]')
      .should("be.visible")
      .type("gagnekafyi@gufum.com");
    cy.get('input[name="password"]')
      .should("be.visible")
      .type("Contraseña123.");
    cy.get('button[type="submit"]').should("be.enabled").click();

    // Esperar la navegación al dashboard
    cy.url().should("include", "/dashboard");

    // Espera explícita para que el botón sea visible antes de hacer click
    cy.contains("Gestión de roles").should("be.visible").click();
  });

  describe("Añadir Rol", () => {
    it("Debe añadir un rol correctamente", () => {
      cy.contains("Añadir rol").should("be.visible").click();

      cy.get('input[name="name"]').should("be.visible").type("Admin");
      cy.get('textarea[name="description"]')
        .should("be.visible")
        .type("Rol de administrador");

      // Espera a que la sección de permisos esté visible
      cy.contains("Rol").parent().find(".icon").should("be.visible").click();
      cy.intercept("POST", "/api/roles", (req) => {
        console.log("Datos enviados:", req.body);
      }).as("crearRol");

      cy.contains("Guardar").click();
      cy.wait("@crearRol");

      // Espera explícita para asegurar que el modal de permisos está abierto
      cy.contains("Permite registrar nuevos Roles").should("be.visible");

      // Uso de `force: true` para asegurar la interacción con el checkbox
      cy.get('input[type="checkbox"]').first().check({ force: true });

      cy.contains("Guardar").should("be.visible").click();

      // Confirmación antes de crear el rol
      cy.contains("¿Desea crear el rol").should("be.visible");
      cy.contains("Sí, confirmar").should("be.visible").click();

      // Espera a la notificación de éxito
      cy.contains("Rol añadido correctamente").should("be.visible");
    });
  });
});
