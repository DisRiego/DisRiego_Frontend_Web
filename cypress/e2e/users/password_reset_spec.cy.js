// cypress/integration/password_reset_spec.js
describe('Password Recovery', () => {
    it('should allow the user to request a password reset link', () => {
      // Simular la respuesta de la API para la solicitud de recuperación de contraseña
      cy.intercept('POST', '/password-reset', {
        statusCode: 200,
        body: {
          success: true,
          message: 'Password reset link sent to email.',
        }
      }).as('passwordResetRequest');
  
      // Visitar la página de recuperación de contraseña
      cy.visit('/password-reset');  // Ajusta la URL de acuerdo con la ruta correcta
  
      // Completar el formulario de recuperación de contraseña con un correo válido
      cy.get('input[name="email"]').type('john.doe@example.com');
      
      // Enviar el formulario
      cy.get('button').contains('Enviar enlace de recuperación').click();
  
      // Esperar la respuesta de la API
      cy.wait('@passwordResetRequest');
  
      // Verificar que el mensaje de éxito se muestra
      cy.contains('Password reset link sent to email.').should('be.visible');
    });
  
    it('should show an error if the email is not found', () => {
      // Simular un error de que el correo no está registrado en la base de datos
      cy.intercept('POST', '/password-reset', {
        statusCode: 404,
        body: {
          success: false,
          message: 'Email not found.',
        }
      }).as('passwordResetError');
  
      // Visitar la página de recuperación de contraseña
      cy.visit('/password-reset');  // Ajusta la URL de acuerdo con la ruta correcta
  
      // Completar el formulario de recuperación de contraseña con un correo no registrado
      cy.get('input[name="email"]').type('nonexistent.user@example.com');
  
      // Enviar el formulario
      cy.get('button').contains('Enviar enlace de recuperación').click();
  
      // Esperar la respuesta de la API
      cy.wait('@passwordResetError');
  
      // Verificar que se muestre el error
      cy.contains('Email not found.').should('be.visible');
    });
  
    it('should show an error if the email field is empty', () => {
      // Intentar solicitar un enlace de recuperación con el campo de correo vacío
      cy.visit('/password-reset');  // Ajusta la URL de acuerdo con la ruta correcta
  
      // Enviar el formulario sin ingresar el correo
      cy.get('button').contains('Enviar enlace de recuperación').click();
  
      // Verificar que se muestra el error de campo vacío
      cy.contains('El campo de correo electrónico es obligatorio').should('be.visible');
    });
  });
  