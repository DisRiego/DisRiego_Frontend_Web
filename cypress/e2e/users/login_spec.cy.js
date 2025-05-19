// cypress/integration/login_spec.js
describe('Login', () => {
    it('should allow the user to log in with correct credentials', () => {
      // Simular la respuesta de la API para el inicio de sesión exitoso
      cy.intercept('POST', '/login', {
        statusCode: 200,
        body: {
          success: true,
          message: 'Login successful',
          token: 'fake-jwt-token',  // Simulación del token JWT
        }
      }).as('loginRequest');
  
      // Visitar la página de inicio de sesión
      cy.visit('/login');  // Ajusta la URL de acuerdo con la ruta correcta
  
      // Completar el formulario de inicio de sesión
      cy.get('input[name="email"]').type('john.doe@example.com');
      cy.get('input[name="password"]').type('SecurePassword123');
  
      // Enviar el formulario
      cy.get('button').contains('Iniciar sesión').click();
  
      // Esperar la respuesta de la API
      cy.wait('@loginRequest');
  
      // Verificar que la respuesta sea exitosa y que el usuario sea redirigido
      cy.contains('Login successful').should('be.visible');
      cy.url().should('include', '/dashboard');  // Verificar que el usuario sea redirigido al dashboard
    });
  
    it('should show an error for incorrect credentials', () => {
      // Simular la respuesta de la API para credenciales incorrectas
      cy.intercept('POST', '/login', {
        statusCode: 401,
        body: {
          success: false,
          message: 'Invalid credentials',
        }
      }).as('loginRequestError');
  
      // Visitar la página de inicio de sesión
      cy.visit('/login');  // Ajusta la URL de acuerdo con la ruta correcta
  
      // Completar el formulario de inicio de sesión con credenciales incorrectas
      cy.get('input[name="email"]').type('john.doe@example.com');
      cy.get('input[name="password"]').type('WrongPassword123');
  
      // Enviar el formulario
      cy.get('button').contains('Iniciar sesión').click();
  
      // Esperar la respuesta de la API
      cy.wait('@loginRequestError');
  
      // Verificar que se muestre el mensaje de error
      cy.contains('Invalid credentials').should('be.visible');
    });
  
    it('should show an error if the email field is empty', () => {
      // Intentar iniciar sesión con el campo de email vacío
      cy.visit('/login');  // Ajusta la URL de acuerdo con la ruta correcta
  
      cy.get('input[name="password"]').type('SecurePassword123');
      cy.get('button').contains('Iniciar sesión').click();
  
      // Verificar que se muestre el error de campo vacío
      cy.contains('El campo de correo electrónico es obligatorio').should('be.visible');
    });
  
    it('should show an error if the password field is empty', () => {
      // Intentar iniciar sesión con el campo de contraseña vacío
      cy.visit('/login');  // Ajusta la URL de acuerdo con la ruta correcta
  
      cy.get('input[name="email"]').type('john.doe@example.com');
      cy.get('button').contains('Iniciar sesión').click();
  
      // Verificar que se muestre el error de campo vacío
      cy.contains('El campo de contraseña es obligatorio').should('be.visible');
    });
  });
  