import { Model, Provider } from '@opencode/plugin';
import type { Types } from 'effect';

export const ELM_PROVIDER_ID = 'elm';
export const ELM_API_BASE_URL = 'https://elm.edina.ac.uk/api/v1';
export const ELM_QWEN_MODEL_ID = 'Qwen/Qwen3.5-397B-A17B-FP8';
export const ELM_MISTRAL_MODEL_ID = 'mistralai/Mistral-Small-4-119B-2603';

// OpenAI-compatible package for V2
const OPENAI_COMPATIBLE_PACKAGE = '@opencode/ai/providers/openai-compatible';

interface ElmProvider {
  info: Provider.Info;
  models: readonly Types.DeepMutable<Model.Info>[];
}

export function buildElmProvider(): ElmProvider {
  const providerId = Provider.ID.make(ELM_PROVIDER_ID);

  const info: Provider.Info = {
    ...Provider.Info.empty(providerId),
    name: 'University of Edinburgh ELM',
    activation: 'enabled',
    package: OPENAI_COMPATIBLE_PACKAGE,
    settings: {
      baseURL: ELM_API_BASE_URL,
    },
  };

  const models: Types.DeepMutable<Model.Info>[] = [
    {
      ...Model.Info.default(providerId, Model.ID.make(ELM_QWEN_MODEL_ID)),
      name: 'Qwen 3.5 397B',
      compatibility: {
        reasoningField: 'reasoning',
      },
      capabilities: {
        tools: true,
        input: ['text', 'image'],
        output: ['text'],
      },
      limit: {
        context: 262144,
        output: 81920,
      },
      enabled: true,
      status: 'active',
    },
    {
      ...Model.Info.default(providerId, Model.ID.make(ELM_MISTRAL_MODEL_ID)),
      name: 'Mistral 4 Small 119B',
      compatibility: {
        reasoningField: 'reasoning',
      },
      capabilities: {
        tools: true,
        input: ['text', 'image'],
        output: ['text'],
      },
      limit: {
        context: 262144,
        output: 81920,
      },
      variants: [
        { id: Model.VariantID.make('low'), settings: { disabled: true } },
        { id: Model.VariantID.make('medium'), settings: { disabled: true } },
      ],
      enabled: true,
      status: 'active',
    },
  ];

  return { info, models };
}
