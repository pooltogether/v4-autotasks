export const isMainnet = (chainId: number): boolean => {
  switch (chainId) {
    case 1:
      return true;
    case 42161:
      return true;
    case 43114:
      return true;
    case 10:
      return true;
    case 137:
      return true;
    default:
      return false;
  }
};

export const isTestnet = (chainId: number): boolean => {
  switch (chainId) {
    case 5:
      return true;
    case 421613:
      return true;
    case 43113:
      return true;
    case 420:
      return true;
    case 80001:
      return true;
    default:
      return false;
  }
};
