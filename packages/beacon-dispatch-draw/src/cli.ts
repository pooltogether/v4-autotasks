import esMain from 'es-main';

import { handler } from './handler';

if (esMain(import.meta)) {
  const {
    RELAYER_API_KEY: apiKey,
    RELAYER_API_SECRET: apiSecret,
    OPTIMISM_GOERLI_PROVIDER_URL: optimismGoerliProviderURL,
  } = process.env;

  handler({
    apiKey,
    apiSecret,
    secrets: {
      optimismGoerliProviderURL,
    },
  })
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export function main() {}
