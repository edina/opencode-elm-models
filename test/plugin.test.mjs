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
  buildElmProvider,
} from '../dist/provider.js';

test('exports an OpenCode V2 plugin with ELM API-key authentication', async () => {
  assert.equal(ElmModelsPlugin.id, ELM_PROVIDER_ID);
  assert.equal(typeof ElmModelsPlugin.setup, 'function');
});

test('builds the production ELM Qwen provider', () => {
  const provider = buildElmProvider();

  assert.equal(provider.info.id, ELM_PROVIDER_ID);
  assert.equal(provider.info.name, 'University of Edinburgh ELM');
  assert.equal(provider.info.package, '@opencode/ai/providers/openai-compatible');
  assert.equal(provider.info.settings?.baseURL, ELM_API_BASE_URL);

  const qwen = provider.models.find(m => m.id === ELM_QWEN_MODEL_ID);
  assert.ok(qwen);
  assert.equal(qwen.name, 'Qwen 3.5 397B');
  assert.equal(qwen.compatibility?.reasoningField, 'reasoning');
  assert.ok(qwen.capabilities?.input?.includes('text'));
  assert.ok(qwen.capabilities?.input?.includes('image'));
  assert.ok(qwen.capabilities?.output?.includes('text'));
  assert.equal(qwen.limit?.context, 262144);
  assert.equal(qwen.limit?.output, 81920);
  assert.equal(qwen.enabled, true);
  assert.equal(qwen.status, 'active');

  const mistral = provider.models.find(m => m.id === ELM_MISTRAL_MODEL_ID);
  assert.ok(mistral);
  assert.equal(mistral.name, 'Mistral 4 Small 119B');
  assert.ok(mistral.variants);
  assert.equal(mistral.variants.length, 2);
  assert.equal(mistral.variants[0].id, 'low');
  assert.equal(mistral.variants[1].id, 'medium');
  assert.equal(mistral.compatibility?.reasoningField, 'reasoning');
  assert.ok(mistral.capabilities?.input?.includes('text'));
  assert.ok(mistral.capabilities?.input?.includes('image'));
  assert.ok(mistral.capabilities?.output?.includes('text'));
  assert.equal(mistral.limit?.context, 262144);
  assert.equal(mistral.limit?.output, 81920);
  assert.equal(mistral.enabled, true);
  assert.equal(mistral.status, 'active');
});
