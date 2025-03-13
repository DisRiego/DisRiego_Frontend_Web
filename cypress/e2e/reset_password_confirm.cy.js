describe("Reset Password Confirm", () => {
    beforeEach(() => {
      cy.visit("http://localhost:5173/login/resetpassword/1"); // Asegúrate de reemplazar ":id" por un token válido en tu entorno de pruebas
    });
  
    it("Debe renderizar el formulario de restablecimiento de contraseña", () => {
      cy.contains("Restablecer contraseña").should("be.visible");
      cy.get("input[name='new_password']").should("exist");
      cy.get("input[name='confirm_password']").should("exist");
      cy.contains("Confirmar").should("be.visible");
    });
  
    it("Debe validar que la nueva contraseña cumpla los requisitos", () => {
      cy.get("input[name='new_password']").type("short");
      cy.contains("Mínimo 12 caracteres").should("have.class", "is-false");
  
      cy.get("input[name='new_password']").clear().type("LongPassword123@");
      cy.contains("Mínimo 12 caracteres").should("have.class", "is-true");
      cy.contains("Mínimo un número").should("have.class", "is-true");
      cy.contains("Mínimo un carácter especial").should("have.class", "is-true");
    });
  
    it("Debe mostrar un error si las contraseñas no coinciden", () => {
      cy.get("input[name='new_password']").type("CorrectPass123@");
      cy.get("input[name='confirm_password']").type("IncorrectPass123@");
      cy.get("button[type='submit']").click();
  
      cy.contains("Las contraseñas no coinciden.").should("be.visible");
    });
  
    it("Debe enviar el formulario correctamente si todo está bien", () => {
      cy.intercept("POST", "**/reset-password/**", { statusCode: 200 }).as("resetPassword");
  
      cy.get("input[name='new_password']").type("ValidPassword123@");
      cy.get("input[name='confirm_password']").type("ValidPassword123@");
      cy.get("button[type='submit']").click();
  
      cy.wait("@resetPassword").its("response.statusCode").should("eq", 200);
      cy.contains("Tu contraseña ha sido actualizada correctamente").should("be.visible");
    });
  
    it("Debe mostrar un error si el token es inválido", () => {
      cy.intercept("POST", "**/reset-password/**", { statusCode: 404 }).as("resetPasswordError");
  
      cy.get("input[name='new_password']").type("ValidPassword123@");
      cy.get("input[name='confirm_password']").type("ValidPassword123@");
      cy.get("button[type='submit']").click();
  
      cy.wait("@resetPasswordError").its("response.statusCode").should("eq", 404);
      cy.contains("El enlace para cambiar la contraseña ha expirado o es inválido.").should("be.visible");
    });
  });
  