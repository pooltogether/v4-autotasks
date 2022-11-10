import { handler } from './handler';

if (require.main === module) {
  const { RELAYER_API_KEY, RELAYER_API_SECRET } = process.env;

  handler({
    apiKey: RELAYER_API_KEY,
    apiSecret: RELAYER_API_SECRET,
  })
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export function main() {}
