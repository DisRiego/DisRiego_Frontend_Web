describe("Pruebas de Login", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/login");
  });

  it("Debe iniciar sesión exitosamente y mantener la sesión después de recargar", () => {
    cy.get('input[name="email"]').type("startlord17@gmail.com");
    cy.get('input[name="password"]').type("Probando123.");
    cy.get('button[type="submit"]').click();

    // Verificar que redirige al dashboard
    cy.url().should("include", "/dashboard");

    // Recargar la página y verificar que sigue autenticado
    cy.reload();
    cy.url().should("include", "/dashboard");
  });

  it("Debe mostrar un mensaje de error al intentar iniciar sesión con una cuenta bloqueada", () => {
    cy.get('input[name="email"]').type("bloqueado@example.com");
    cy.get('input[name="password"]').type("Password123!");
    cy.get('button[type="submit"]').click();

    // Verificar que muestra el mensaje de error
    cy.contains("El correo electrónico o la contraseña son inválidos.").should("be.visible");
  });

  it("Debe permitir regresar a la página anterior usando el botón de volver", () => {
    cy.get(".button-back").click();

    // Verificar que vuelve a la página de inicio
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  it("Debe manejar correctamente un error 500 del servidor", () => {
    cy.intercept("POST", "/users/login", {
      statusCode: 500,
      body: { message: "Error interno del servidor" },
    }).as("loginRequest");

    cy.get('input[name="email"]').type("usuario@example.com");
    cy.get('input[name="password"]').type("Password123!");
    cy.get('button[type="submit"]').click();

    // Esperar a la solicitud y verificar el error
    cy.wait("@loginRequest");
    cy.contains("El correo electrónico o la contraseña son incorrectos.").should("be.visible");
  });

  it("Debe mostrar un mensaje de error al intentar iniciar sesión con credenciales incorrectas", () => {
    cy.get('input[name="email"]').type("email@incorrecto.com");
    cy.get('input[name="password"]').type("ClaveIncorrecta!");
    cy.get('button[type="submit"]').click();

    cy.contains("El correo electrónico o la contraseña son incorrectos.").should("be.visible");
  });

  it("Debe mostrar mensajes de validación cuando los campos están vacíos", () => {
    cy.get('button[type="submit"]').click();

    cy.contains("El correo electrónico o la contraseña son inválidos.").should("be.visible");
  });

  it("Debe permitir iniciar sesión con Google", () => {
    cy.get('button:contains("Google")').click();
    cy.url().should("include", "accounts.google.com");
  });

  it("Debe permitir iniciar sesión con Microsoft", () => {
    cy.get('button:contains("Microsoft")').click();
    cy.url().should("include", "login.microsoftonline.com");
  });
});
