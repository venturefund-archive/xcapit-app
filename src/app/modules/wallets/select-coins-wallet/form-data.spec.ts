export const SELECT_COINS_FORM_DATA = {
  valid: {
    ERC20: {
      ETH: true,
      UNI: true,
      LINK: false,
      USDT: false,
    },
    MATIC: {
      MATIC: false,
    },
    RSK: {
      RBTC: false,
      RIF: false,
      SOV: false,
    },
    BSC_BEP20: {
      BNB: false,
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
    },
    RSK: {
      RBTC: false,
      RIF: false,
      SOV: false,
    },
    BSC_BEP20: {
      BNB: false,
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
      MATIC: true,
    },
    RSK: {
      RBTC: true,
      RIF: true,
      SOV: false,
    },
    BSC_BEP20: {
      BNB: false,
    },
  },
};
