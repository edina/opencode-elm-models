import type { Plugin } from '@opencode-ai/plugin';

import { applyElmProvider, ELM_PROVIDER_ID } from './provider.js';

export const ElmModelsPlugin: Plugin = async () => ({
  config: async (config) => {
    applyElmProvider(config);
  },
  auth: {
    provider: ELM_PROVIDER_ID,
    methods: [
      {
        type: 'api',
        label: 'ELM API key',
      },
    ],
  },
});
