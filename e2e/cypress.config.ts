import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run my-starter-template:serve:development',
        production: 'nx run my-starter-template:serve:production',
      },
      ciWebServerCommand: 'nx run my-starter-template:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
