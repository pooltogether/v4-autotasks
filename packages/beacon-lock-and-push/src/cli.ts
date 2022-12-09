import esMain from 'es-main';

import { handler } from './handler';

if (esMain(import.meta)) {
  const {
    RELAYER_API_KEY: apiKey,
    RELAYER_API_SECRET: apiSecret,
    ARBITRUM_GOERLI_PROVIDER_URL: arbitrumGoerliProviderURL,
    ETHEREUM_GOERLI_PROVIDER_URL: ethereumGoerliProviderURL,
    POLYGON_MUMBAI_PROVIDER_URL: polygonMumbaiProviderURL,
    OPTIMISM_GOERLI_PROVIDER_URL: optimismGoerliProviderURL,
  } = process.env;

  handler({
    apiKey,
    apiSecret,
    secrets: {
      ethereumGoerliProviderURL,
      polygonMumbaiProviderURL,
      optimismGoerliProviderURL,
      arbitrumGoerliProviderURL,
    },
  })
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export function main() {}
