import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://learnsatmath.com',
  redirects: {
    '/': 'https://www.bedrockprep.com/',
    '/bedrock': 'https://www.bedrockprep.com/',
    '/home': 'https://www.bedrockprep.com/',
    '/tutoring': 'https://www.bedrockprep.com/',
  },
  integrations: [tailwind()],
});
