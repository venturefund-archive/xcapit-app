export const SELECT_COINS_FORM_DATA = {
  valid: {
    ERC20: {
      ETH: true,
      UNI: true,
      LINK: false,
      USDT: false,
    },
    MATIC: {
      MATIC: true,
      USDC: false,
    },
    RSK: {
      RBTC: false,
      RIF: false,
    },
    BSC_BEP20: {
      BNB: false,
    },
    SOLANA: {
      SOL: true,
    },
  },
  invalid: {
    ERC20: {
      ETH: false,
      UNI: false,
      USDT: false,
      LINK: false,
    },
    MATIC: {
      MATIC: false,
      USDC: false,
    },
    RSK: {
      RBTC: false,
      RIF: false,
    },
    BSC_BEP20: {
      BNB: false,
    },
    SOLANA: {
      SOL: false,
    },
  },
  allTrue: {
    ERC20: {
      ETH: true,
      UNI: true,
      USDT: true,
      LINK: true,
    },
    MATIC: {
      MATIC: true,
      USDC: true,
    },
    RSK: {
      RBTC: true,
      RIF: true,
    },
    BSC_BEP20: {
      BNB: true,
    },
    SOLANA: {
      SOL: true,
    },
  },
  editTokensOriginal: {
    ERC20: {
      ETH: true,
      UNI: false,
      USDT: true,
      LINK: false,
    },
    MATIC: {
      MATIC: false,
      USDC: false,
    },
    RSK: {
      RBTC: true,
      RIF: true,
    },
    BSC_BEP20: {
      BNB: true,
    },
    SOLANA: {
      SOL: true,
    },
  },
};
