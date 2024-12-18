import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

import react from '@astrojs/react';

export default defineConfig({
  output: 'server',

  adapter: node({
    mode: 'middleware'
  }),

  middleware: './src/middleware/auth.ts',
  integrations: [react()]
});