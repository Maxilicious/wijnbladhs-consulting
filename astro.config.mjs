import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

const ViewTransitions = () => ({
  name: '@astrojs/view-transitions'
});

export default defineConfig({
  output: 'static',
  integrations: [tailwind(), ViewTransitions()]
});
