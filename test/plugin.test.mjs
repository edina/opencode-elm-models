import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ElmModelsPlugin,
} from '../dist/index.js';
import {
  ELM_API_BASE_URL,
  ELM_PROVIDER_ID,
  ELM_QWEN_MODEL_ID,
  ELM_MISTRAL_MODEL_ID,
  applyElmProvider,
} from '../dist/provider.js';

test('exports an OpenCode V1 plugin with ELM API-key authentication', async () => {
  const hooks = await ElmModelsPlugin({});
  assert.equal(hooks.auth.provider, ELM_PROVIDER_ID);
  assert.deepEqual(hooks.auth.methods, [{ type: 'api', label: 'ELM API key' }]);
  assert.equal(typeof hooks.config, 'function');
});

test('adds the production ELM Qwen provider', () => {
  const config = {};
  applyElmProvider(config);

  assert.equal(config.provider.openai.options.baseURL, ELM_API_BASE_URL);

  const provider = config.provider[ELM_PROVIDER_ID];
  assert.equal(provider.npm, '@ai-sdk/openai-compatible');
  assert.equal(provider.name, 'University of Edinburgh ELM');
  assert.deepEqual(provider.env, ['ELM_API_KEY']);
  assert.equal(provider.options.baseURL, ELM_API_BASE_URL);

  const qwen = provider.models[ELM_QWEN_MODEL_ID];
  assert.equal(qwen.name, 'Qwen 3.5 397B');
  assert.equal(qwen.reasoning, true);
  assert.deepEqual(qwen.interleaved, { field: 'reasoning' });
  assert.deepEqual(qwen.modalities.input, ['text', 'image']);
  assert.deepEqual(qwen.limit, { context: 262144, output: 81920 });

  const mistral = provider.models[ELM_MISTRAL_MODEL_ID];
  assert.equal(mistral.name, 'Mistral 4 Small 119B');
  assert.equal(mistral.reasoning, true);
  assert.deepEqual(mistral.variants, {
    low: { disabled: true },
    medium: { disabled: true },
  });
  assert.deepEqual(mistral.interleaved, { field: 'reasoning' });
  assert.deepEqual(mistral.modalities.input, ['text', 'image']);
  assert.deepEqual(mistral.limit, { context: 262144, output: 81920 });
});

test('preserves other providers and lets user configuration override defaults', () => {
  const config = {
    provider: {
      other: {
        name: 'Other provider',
        models: {},
      },
      openai: {
        options: {
          baseURL: 'http://localhost:8080/openai/v1',
        },
      },
      elm: {
        options: {
          baseURL: 'http://localhost:8080/v1',
          customOption: true,
        },
        models: {
          [ELM_QWEN_MODEL_ID]: {
            name: 'Local display name',
          },
          'future/model': {
            name: 'Future model',
          },
        },
      },
    },
  };

  applyElmProvider(config);

  assert.equal(config.provider.other.name, 'Other provider');
  assert.equal(config.provider.openai.options.baseURL, 'http://localhost:8080/openai/v1');
  assert.equal(config.provider.elm.options.baseURL, 'http://localhost:8080/v1');
  assert.equal(config.provider.elm.options.customOption, true);
  assert.equal(config.provider.elm.models[ELM_QWEN_MODEL_ID].name, 'Local display name');
  assert.equal(config.provider.elm.models[ELM_QWEN_MODEL_ID].reasoning, true);
  assert.equal(config.provider.elm.models['future/model'].name, 'Future model');
});
