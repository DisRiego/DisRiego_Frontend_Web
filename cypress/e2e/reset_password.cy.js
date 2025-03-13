describe("Pruebas de Restablecimiento de Contraseña", () => {
    beforeEach(() => {
      cy.visit("http://localhost:5173/login/resetpassword/1"); 
    });
  
    it("Debe cargar la página de restablecimiento de contraseña correctamente", () => {
      cy.contains("¿Olvidaste tu contraseña?").should("be.visible");
      cy.contains("No te preocupes, ingresa tu correo para recibir las instrucciones").should("be.visible");
      cy.get('input[name="email"]').should("be.visible");
      cy.get('button[type="submit"]').should("be.visible");
    });
  
    it("No debe permitir enviar el formulario con el campo vacío", () => {
      cy.get('button[type="submit"]').click();
      cy.contains("El correo electrónico es inválido.").should("be.visible");
    });
  
    it("No debe permitir enviar un correo inválido", () => {
      cy.get('input[name="email"]').type("correo-invalido");
      cy.get('button[type="submit"]').click();
      cy.contains("El correo electrónico es inválido.").should("be.visible");
    });
  
    it("Debe mostrar un mensaje de éxito tras enviar un email válido", () => {
      cy.intercept("POST", "**/resetpassword", { statusCode: 200, body: { token: "fake-token" } }).as("resetPassword");
  
      cy.get('input[name="email"]').type("usuario@example.com");
      cy.get('button[type="submit"]').click();
      
      cy.wait("@resetPassword");
  
      cy.contains("Correo enviado exisotamente").should("be.visible");
      cy.contains("Hemos enviado un correo con las instrucciones").should("be.visible");
    });
  
    it("Debe mostrar un mensaje de error si hay un problema con el envío", () => {
      cy.intercept("POST", "**/resetpassword", { statusCode: 500, body: { message: "Error interno del servidor" } }).as("resetPassword");
  
      cy.get('input[name="email"]').type("usuario@example.com");
      cy.get('button[type="submit"]').click();
  
      cy.wait("@resetPassword");
  
      cy.contains("Error al enviar el correo de recuperación").should("be.visible");
    });
  
    it("Debe permitir regresar a la página de inicio de sesión", () => {
      cy.get(".button-back").click();
      cy.url().should("include", "/login");
    });
  });
  