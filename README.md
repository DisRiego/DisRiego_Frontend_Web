# DisRiego_Frontend_Web

Este repositorio contiene el frontend web de **DisRiego**, desarrollado en **React**. Se despliega en Vercel y utiliza un proceso automatizado de build y pruebas mediante CI/CD.

---

## 1. Organización del Repositorio y Ramas

- **Ramas Principales:**
  - **develop:** Rama de desarrollo activa.
  - **test:** Rama para integración y pruebas.
  - **main:** Rama de producción.

- **Flujo de Trabajo:**
  1. Desarrollo en `develop`.
  2. Merge a `test` para ejecutar pruebas.
  3. Merge a `main` para el despliegue en producción.

---

## 2. Configuración del Entorno Local

### Requisitos
- [Visual Studio Code](https://code.visualstudio.com/) u otro IDE de preferencia.
- Node.js (versión LTS recomendada).

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/DisRiego_Frontend_Web.git
   cd DisRiego_Frontend_Web
   ```

2. **Instalar Dependencias:**
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno:**
   - Copia el archivo `.env.example` a `.env` y ajusta los valores necesarios.
   - Ejemplo:
     ```dotenv
     REACT_APP_API_URL=https://api.disriego.com
     REACT_APP_OTRA_VARIABLE=valor
     ```

4. **Ejecución en Desarrollo:**
   - Inicia el servidor de desarrollo:
     ```bash
     npm start
     ```

5. **Ejecución de Tests:**
   - Ejecuta los tests locales:
     ```bash
     npm test
     ```

---

## 3. Integración de CI/CD con GitHub Actions

### Flujo de CI/CD

- **CI:**  
  - Se ejecutan pruebas unitarias e integración en cada push o Pull Request en `develop` y `test`.

- **CD:**  
  - Al fusionar en `main`, se dispara el proceso de despliegue en Vercel.

### Ejemplo de Workflow (archivo `.github/workflows/ci-cd.yml`):
```yaml
name: CI/CD Frontend Web

on:
  push:
    branches: [develop, test, main]
  pull_request:
    branches: [develop, test, main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install Dependencies
        run: npm install
      - name: Run Tests
        run: npm test

  deploy:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to Vercel
        run: echo "Deploying to Vercel..."
```

---

## 4. Despliegue en Vercel

- **Configuración:**
  - El proyecto se despliega en Vercel, que se encarga del build automático.
  - Configura las variables de entorno necesarias en el panel de Vercel (por ejemplo, `REACT_APP_API_URL`).

- **Proceso de Despliegue:**
  - Al fusionar en `main`, el workflow de GitHub Actions dispara el deploy en Vercel.

---

## 5. Consideraciones Finales

- **Variables Sensibles:**  
  - Usa GitHub Secrets para el CI/CD y configura las variables en el panel de Vercel.
- **Actualización:**  
  - Este README se actualizará conforme se presenten cambios o imprevistos.
- **Soporte:**  
  - Para dudas, abre un issue en el repositorio o contacta al líder del equipo.

¡A desarrollar una experiencia web de calidad para DisRiego!
