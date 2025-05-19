// cypress/integration/update_user_spec.js
describe('Update User Personal Information', () => {
    it('should allow the user to update their personal information successfully', () => {
      // Simular la respuesta de la API para la actualización exitosa de los datos personales
      cy.intercept('PUT', '/users/1', {
        statusCode: 200,
        body: {
          success: true,
          message: 'User updated successfully',
        }
      }).as('updateUser');
  
      // Visitar la página de actualización de datos personales
      cy.visit('/update-user');  // Ajusta la URL de acuerdo con la ruta correcta
  
      // Completar el formulario de actualización de usuario
      cy.get('input[name="name"]').clear().type('Johnathan Doe');  // Cambiar el nombre
      cy.get('input[name="email"]').clear().type('john.doe.new@example.com');  // Cambiar el correo electrónico
  
      // Enviar el formulario
      cy.get('button').contains('Actualizar Información').click();
  
      // Esperar la respuesta de la API
      cy.wait('@updateUser');
  
      // Verificar que el mensaje de éxito se muestra
      cy.contains('User updated successfully').should('be.visible');
  
      // Verificar que el nuevo nombre y correo se muestran
      cy.contains('Johnathan Doe').should('be.visible');
      cy.contains('john.doe.new@example.com').should('be.visible');
    });
  
    it('should show an error if the email is invalid', () => {
      // Simular un error de correo electrónico inválido
      cy.visit('/update-user');  // Ajusta la URL de acuerdo con la ruta correcta
  
      // Completar el formulario con un correo inválido
      cy.get('input[name="name"]').clear().type('Johnathan Doe');
      cy.get('input[name="email"]').clear().type('invalid-email');  // Correo inválido
  
      // Enviar el formulario
      cy.get('button').contains('Actualizar Información').click();
  
      // Verificar que se muestre el mensaje de error
      cy.contains('El correo electrónico no es válido').should('be.visible');
    });
  
    it('should show an error if the name is empty', () => {
      // Intentar actualizar el nombre con un campo vacío
      cy.visit('/update-user');  // Ajusta la URL de acuerdo con la ruta correcta
  
      cy.get('input[name="name"]').clear();  // Dejar el nombre vacío
      cy.get('input[name="email"]').clear().type('john.doe.new@example.com');
  
      // Enviar el formulario
      cy.get('button').contains('Actualizar Información').click();
  
      // Verificar que se muestra el mensaje de error
      cy.contains('El nombre es obligatorio').should('be.visible');
    });
  });
  