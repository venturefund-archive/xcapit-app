import { RawSession } from '../../../../shared/models/wallet-connect/wc-session/wc-session';

export const rawSession: RawSession = {
  pairingTopic: '',
  relay: {
    protocol: 'irn',
  },
  namespaces: {
    eip155: {
      methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
      events: ['chainChanged', 'accountsChanged'],
      accounts: ['eip155:80001:0x85937c266b25dafad5fc3b6283b566013ae42565'],
    },
  },
  requiredNamespaces: {
    eip155: {
      methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
      chains: ['eip155:80001'],
      events: ['chainChanged', 'accountsChanged'],
    },
  },
  optionalNamespaces: {},
  controller: '6ed6868a4fb4d0b28f41c7c84a4eadf725fdb52da9a08d58a5094268d4ea233b',
  expiry: 1678246541,
  topic: 'a847b03d85d017ff3b7b59b428a4b3f2fa443f49490c79ceb81204b9e2a1a391',
  acknowledged: true,
  self: {
    publicKey: '6ed6868a4fb4d0b28f41c7c84a4eadf725fdb52da9a08d58a5094268d4ea233b',
    metadata: {
      name: 'Xcapit Wallet',
      description: 'Xcapit Wallet',
      url: 'https://xcapit.com/',
      icons: ['https://uploads-ssl.webflow.com/62ae2e5d0eca2586c139e2af/633d847e9aa38e40e7e94c9a_logo-xcapit.svg'],
    },
  },
  peer: {
    publicKey: '97c47b620f12b13f0634a29a1fc8bd6d5a1bdad28ccd58208e775f947d7a2300',
    metadata: {
      description: 'React App for WalletConnect',
      url: 'https://react-app.walletconnect.com',
      icons: ['https://avatars.githubusercontent.com/u/37784886'],
      name: 'React App',
    },
  },
};
