import { Plugin } from '@opencode/plugin';

import { ELM_PROVIDER_ID, buildElmProvider } from './provider.js';

export const ElmModelsPlugin = Plugin.define({
  id: ELM_PROVIDER_ID,
  async setup(ctx) {
    // Add the ELM provider with its models
    ctx.provider.transform((editor) => {
      const provider = buildElmProvider();
      if (!editor.get(provider.info.id)) {
        editor.add({
          info: provider.info,
          models: provider.models,
        });
      }
    });
  },
});

export default ElmModelsPlugin;
