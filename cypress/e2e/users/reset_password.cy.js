describe("Pruebas de Restablecimiento de Contraseña", () => {
    beforeEach(() => {
      cy.visit("http://localhost:5173/login/resetpassword"); 
    });
  
    it("Debe cargar la página de restablecimiento de contraseña correctamente", () => {
      cy.contains("¿Olvidaste tu contraseña?").should("be.visible");
      cy.contains("No te preocupes, ingresa tu correo para recibir las instrucciones de restablecer la contraseña.").should("be.visible");
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
      
      // Buscar el texto directamente (ignorando clases CSS)
      cy.contains("El correo electrónico es inválido.")
    });
  
    it("Debe mostrar un mensaje de éxito tras enviar un email válido", () => {
      cy.intercept("POST", "**/resetpassword", { statusCode: 200, body: { token: "bc6ba1ef-a068-4eed-8f7f-df110d484bbb" } }).as("resetPassword");
  
      cy.get('input[name="email"]').type("startlord17@gmail.com");
      cy.get('button[type="submit"]').click();
      
  
      cy.contains("Correo enviado exisotamente").should("be.visible");
      cy.contains("Hemos enviado un correo con las instrucciones para restablecer o recordar tu contraseña. Revisa tu bandeja de entrada y, si no lo encuentras, verifica en la carpeta de spam o correo no deseado.").should("be.visible");
    });

    //it("Debe mostrar un mensaje de error si hay un problema con el envío", () => {
      //cy.intercept(
        "POST",
        "**/resetpassword",
        { statusCode: 500, body: { message: "Error interno del servidor" } }
      //).as("resetPassword");
    
      //cy.visit("http://localhost:5173/login/resetpassword");
    
      //cy.get('input[name="email"]').type("startlord17@gmail.com");
      //cy.get('button[type="submit"]').click();
    
      //cy.contains("Error al enviar el correo de recuperación").should("be.visible");
    //});
    
  
    it("Debe permitir regresar a la página de inicio de sesión", () => {
      cy.get(".button-back").click();
      cy.url().should("include", "/login");
    });
  });
  