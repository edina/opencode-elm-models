import type { Config } from '@opencode-ai/plugin';

export const ELM_PROVIDER_ID = 'elm';
export const ELM_API_BASE_URL = 'https://elm.edina.ac.uk/api/v1';
export const ELM_QWEN_MODEL_ID = 'Qwen/Qwen3.5-397B-A17B-FP8';

type ProviderConfig = NonNullable<Config['provider']>[string];

// OpenCode V1's runtime config supports `interleaved`, but the published
// Config type in @opencode-ai/plugin 1.x does not expose it yet.
export const ELM_PROVIDER = {
  npm: '@ai-sdk/openai-compatible',
  name: 'University of Edinburgh ELM',
  env: ['ELM_API_KEY'],
  options: {
    baseURL: ELM_API_BASE_URL,
  },
  models: {
    [ELM_QWEN_MODEL_ID]: {
      name: 'Qwen 3.5 397B',
      reasoning: true,
      interleaved: {
        field: 'reasoning',
      },
      modalities: {
        input: ['text', 'image'],
        output: ['text'],
      },
      limit: {
        context: 262144,
        output: 81920,
      },
    },
  },
} as ProviderConfig;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeDefaults<T>(defaults: T, override: T | undefined): T {
  if (!isRecord(defaults) || !isRecord(override)) return override ?? defaults;

  const result: Record<string, unknown> = { ...defaults };
  for (const [key, value] of Object.entries(override)) {
    const defaultValue = result[key];
    result[key] =
      isRecord(defaultValue) && isRecord(value)
        ? mergeDefaults(defaultValue, value)
        : value;
  }
  return result as T;
}

export function applyElmProvider(config: Config): void {
  config.provider ??= {};
  config.provider.openai = mergeDefaults(
    { options: { baseURL: ELM_API_BASE_URL } } as ProviderConfig,
    config.provider.openai,
  );
  config.provider[ELM_PROVIDER_ID] = mergeDefaults(
    ELM_PROVIDER,
    config.provider[ELM_PROVIDER_ID],
  );
}
