import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Para generar reportes con mochawesome
      on('after:run', () => {
        require('mochawesome-merge')()
          .then((report) => {
            const fs = require('fs');
            fs.writeFileSync('cypress/results/report.json', JSON.stringify(report));
          });
      });
      return config;
    },
    reporter: 'mochawesome',  // Usamos mochawesome como el reporter
    reporterOptions: {
      reportDir: 'cypress/results',  // El directorio donde se almacenarán los reportes
      overwrite: true,
      html: true,  // Genera un reporte en HTML
      json: false,  // No Genera un reporte en formato JSON
    },
  },
});
