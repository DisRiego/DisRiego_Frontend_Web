// cypress/integration/change_password_spec.js
describe('Change Password', () => {
  it('should allow the user to change their password successfully', () => {
    // Simular la respuesta de la API para el cambio de contraseña exitoso
    cy.intercept('POST', '/change-password', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Password changed successfully',
      }
    }).as('changePasswordRequest');

    // Visitar la página de cambio de contraseña
    cy.visit('/change-password');  // Ajusta la URL de acuerdo con la ruta correcta

    // Completar el formulario de cambio de contraseña
    cy.get('input[name="currentPassword"]').type('OldPassword123');
    cy.get('input[name="newPassword"]').type('NewSecurePassword123');
    cy.get('input[name="confirmNewPassword"]').type('NewSecurePassword123');

    // Enviar el formulario
    cy.get('button').contains('Cambiar Contraseña').click();

    // Esperar la respuesta de la API
    cy.wait('@changePasswordRequest');

    // Verificar que la respuesta sea exitosa
    cy.contains('Password changed successfully').should('be.visible');
  });

  it('should show an error if the new passwords do not match', () => {
    // Simular el intento de cambio de contraseña con contraseñas no coincidentes
    cy.visit('/change-password');  // Ajusta la URL de acuerdo con la ruta correcta

    cy.get('input[name="currentPassword"]').type('OldPassword123');
    cy.get('input[name="newPassword"]').type('NewSecurePassword123');
    cy.get('input[name="confirmNewPassword"]').type('DifferentPassword123');

    // Enviar el formulario
    cy.get('button').contains('Cambiar Contraseña').click();

    // Verificar que se muestra el mensaje de error de contraseñas no coincidentes
    cy.contains('Las contraseñas no coinciden').should('be.visible');
  });

  it('should show an error if the new password is too short', () => {
    // Intentar cambiar la contraseña con una nueva contraseña demasiado corta
    cy.visit('/change-password');  // Ajusta la URL de acuerdo con la ruta correcta

    cy.get('input[name="currentPassword"]').type('OldPassword123');
    cy.get('input[name="newPassword"]').type('short');
    cy.get('input[name="confirmNewPassword"]').type('short');

    // Enviar el formulario
    cy.get('button').contains('Cambiar Contraseña').click();

    // Verificar que se muestra el mensaje de error de contraseña demasiado corta
    cy.contains('La nueva contraseña debe tener al menos 8 caracteres').should('be.visible');
  });

  it('should show an error if the current password is incorrect', () => {
    // Simular el intento de cambiar la contraseña con la contraseña actual incorrecta
    cy.intercept('POST', '/change-password', {
      statusCode: 400,
      body: {
        success: false,
        message: 'Incorrect current password',
      }
    }).as('changePasswordError');

    cy.visit('/change-password');  // Ajusta la URL de acuerdo con la ruta correcta

    cy.get('input[name="currentPassword"]').type('IncorrectPassword123');
    cy.get('input[name="newPassword"]').type('NewSecurePassword123');
    cy.get('input[name="confirmNewPassword"]').type('NewSecurePassword123');

    // Enviar el formulario
    cy.get('button').contains('Cambiar Contraseña').click();

    // Esperar la respuesta de la API
    cy.wait('@changePasswordError');

    // Verificar que se muestra el error
    cy.contains('Incorrect current password').should('be.visible');
  });
});
