// cypress/integration/logout_spec.js
describe('Logout', () => {
    it('should allow the user to log out successfully', () => {
      // Simular la respuesta de la API para cerrar sesión exitosamente
      cy.intercept('POST', '/logout', {
        statusCode: 200,
        body: {
          success: true,
          message: 'Logout successful',
        }
      }).as('logoutRequest');
  
      // Visitar la página del dashboard (o la página principal después de login)
      cy.visit('/dashboard');  // Ajusta la URL de acuerdo con la ruta correcta
  
      // Hacer clic en el botón de cerrar sesión
      cy.get('button').contains('Cerrar sesión').click();
  
      // Esperar la respuesta de la API
      cy.wait('@logoutRequest');
  
      // Verificar que el mensaje de éxito se muestre
      cy.contains('Logout successful').should('be.visible');
  
      // Verificar que el usuario ha sido redirigido a la página de inicio o login
      cy.url().should('include', '/login');  // Ajusta la URL de acuerdo con la ruta de login
    });
  
    it('should show an error if the logout request fails', () => {
      // Simular un error de cierre de sesión (por ejemplo, no autorizado)
      cy.intercept('POST', '/logout', {
        statusCode: 401,
        body: {
          success: false,
          message: 'Session expired or unauthorized',
        }
      }).as('logoutError');
  
      // Visitar la página del dashboard
      cy.visit('/dashboard');  // Ajusta la URL de acuerdo con la ruta correcta
  
      // Hacer clic en el botón de cerrar sesión
      cy.get('button').contains('Cerrar sesión').click();
  
      // Esperar la respuesta de la API
      cy.wait('@logoutError');
  
      // Verificar que se muestra el mensaje de error
      cy.contains('Session expired or unauthorized').should('be.visible');
    });
  });
  