// cypress/integration/create_role_spec.js
describe('Create Role with Permissions', () => {
  it('should allow a user to create a new role with selected permissions from the modal', () => {

    // Visitar la página de roles
    cy.visit('http://localhost:5173/dashboard/rol'); // Asegúrate de que esta URL coincida con la ruta de tu vista de roles

    // Esperar que los permisos sean cargados
    cy.wait(3000);

    // Hacer clic en el botón "Añadir Rol" que abre el modal
    cy.get('button.color-hover').click();  // Asegúrate de que este texto coincida con el botón de crear rol

    // Verificar que el modal se ha abierto
    cy.get('.modal').should('be.visible');  // Asegúrate de que `.modal` es la clase del modal

    // Hacer clic en el texto "Categoría" para desplegar los permisos
    cy.get('p.has-text-weight-bold').click();  // Buscar el texto "Categoría" para desplegar los permisos

    // Verificar que los permisos se muestran después de hacer clic en "Categoría"
    cy.get('.accordion-body').should('be.visible'); // Verificar que los permisos se han desplegado

    // Completar el formulario en el modal
    cy.get('input[name="name"]').type('Admin Role');  // Nombre del rol
    cy.get('textarea[name="description"]').type('Role for managing admin tasks');  // Descripción del rol

    // Seleccionar permisos dentro del modal
    cy.get('input[name="1"]').check(); // Selecciona "Crear usuario"
    cy.get('input[name="2"]').check(); // Selecciona "Editar usuario"

    // Enviar el formulario dentro del modal
    cy.get('button').contains('Guardar').click();  // Botón para guardar el rol

    // Verificar que el mensaje de confirmación se muestra
    cy.contains('¿Desea crear el rol "Admin Role"?').should('be.visible');
  });

  it('should show validation errors if no permissions are selected in the modal', () => {
    // Visitar la página de roles
    cy.visit('http://localhost:5173/dashboard/rol');  // Asegúrate de que esta URL coincida con la ruta de tu vista de roles

    // Hacer clic en el botón "Crear Rol" que abre el modal
    cy.get('button.color-hover').click();

    // Verificar que el modal se ha abierto
    cy.get('.modal').should('be.visible');

    // Completar el formulario sin seleccionar permisos
    cy.get('input[name="name"]').type('Admin Role');
    cy.get('textarea[name="description"]').type('Role for managing admin tasks');

    // Intentar enviar el formulario sin seleccionar permisos
    cy.get('button').contains('Guardar').click();

    // Verificar que el error de permisos se muestra
    cy.contains('Debe seleccionar al menos un permiso').should('be.visible');
  });

  it('should allow an admin to create a new role with permissions', () => {
    // Visitar la página de creación de roles
    cy.visit('http://localhost:5173/dashboard/rol');  // Ajusta la URL de acuerdo con la ruta correcta
    // Hacer clic en el botón "Añadir Rol" que abre el modal
    cy.get('button.color-hover').click();  // Asegúrate de que este texto coincida con el botón de crear rol

    // Verificar que el modal se ha abierto
    cy.get('.modal').should('be.visible');  // Asegúrate de que `.modal` es la clase del modal

    // Hacer clic en el texto "Categoría" para desplegar los permisos
    cy.get('p.has-text-weight-bold').click();  // Buscar el texto "Categoría" para desplegar los permisos

    // Verificar que los permisos se muestran después de hacer clic en "Categoría"
    cy.get('.accordion-body').should('be.visible'); // Verificar que los permisos se han desplegado

    // Completar el formulario de creación de rol
    cy.get('input[name="name"]').type('Admin Role');
    cy.get('textarea[name="description"]').type('Role for managing admin tasks');

    // Seleccionar los permisos para el rol
    cy.get('input[name="1"]').check(); // Crear usuario
    cy.get('input[name="2"]').check(); // Editar usuario

    // Enviar el formulario
    cy.get('button').contains('Guardar').click();

    cy.contains('¿Desea crear el rol "Admin Role"?').should('be.visible');

    // Enviar el formulario
    cy.get('.is-centered > .buttons > .color-hover').click();

    // Verificar que el rol ha sido creado correctamente
    cy.contains('Se creo el rol').should('be.visible');
    
    // Verificar que el nuevo rol se muestra en la lista
    cy.contains('Admin Role').should('be.visible');
  });
});
