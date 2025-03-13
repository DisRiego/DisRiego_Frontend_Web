import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      // Importamos dinámicamente los módulos
      const mochawesomeMerge = await import("mochawesome-merge");
      const fs = await import("fs");

      on("after:run", async () => {
        const report = await mochawesomeMerge.default();
        fs.writeFileSync("cypress/results/report.json", JSON.stringify(report));
      });

      return config;
    },
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/results",
      overwrite: true,
      html: true,
      json: false,
    },
  },
});
