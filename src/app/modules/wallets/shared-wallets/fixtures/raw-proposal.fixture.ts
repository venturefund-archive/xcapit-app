import { rawValidRequiredNamespaces } from './raw-namespaces.fixture';
import { verifyContext } from './raw-wallet-connect-requests';

export const rawPeerMetadata = {
  description: 'React App for WalletConnect',
  url: 'https://react-app.walletconnect.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  name: 'React App',
};

export const rawProposalWithoutOptionalNamespaces = {
  id: 1677598962631865,
  params: {
    id: 1677598962631865,
    pairingTopic: '905189e9ee5faee1e08b157d0c86c5ee55c4c5e5f43418b48f8c7c66900eb2c8',
    expiry: 1677599266,
    requiredNamespaces: rawValidRequiredNamespaces,
    optionalNamespaces: null,
    relays: [
      {
        protocol: 'irn',
      },
    ],
    proposer: {
      publicKey: 'b0e265840a5a5a94dfb5a4ffccae8de8a96adc303e663b5a14dcb20fa5408f63',
      metadata: rawPeerMetadata,
    },
  },
  verifyContext: verifyContext,
};

export const rawRequiredNamespaces = {
  polygon: {
    eip155: {
      chains: ['eip155:137'],
      methods: ['eth_sendTransaction', 'personal_sign'],
      events: ['chainChanged', 'accountsChanged'],
      rpcMap: {
        '137': 'https://poly-mainnet.gateway.pokt.network/v1/lb/62b3314e123e6f00397f19ca',
      },
    },
  },
  ethereum: {
    eip155: {
      chains: ['eip155:1'],
      methods: ['eth_sendTransaction', 'personal_sign'],
      events: ['chainChanged', 'accountsChanged'],
      rpcMap: {
        '1': 'https://eth-mainnet.g.alchemy.com/v2/V4IJ6qnD4Rb18k6jW_LJJfB9xSwiUbIC',
      },
    },
  },
};

export const rawProposal = (requiredNamespaceNetwork: string) => {
  return {
    id: 1695730455129128,
    params: {
      id: 1695730455129128,
      pairingTopic: '108ab9a7c5a9391e1ad159f3179c006f26f7a6e44c775703d6420302b94da308',
      expiry: 1695730762,
      requiredNamespaces: rawRequiredNamespaces[requiredNamespaceNetwork],
      optionalNamespaces: rawOptionalNamespaces,
      relays: [
        {
          protocol: 'irn',
        },
      ],
      proposer: {
        publicKey: '8ac60872601cf5328a65c6337c1e8d549c2c23d28b4a96b27f77ca104bb9e734',
        metadata: rawPeerMetadata,
      },
    },
  };
};

export const rawOptionalNamespaces = {
  eip155: {
    chains: ['eip155:1', 'eip155:137', 'eip155:1313161554'],
    methods: [
      'eth_sendTransaction',
      'personal_sign',
      'eth_signTransaction',
      'eth_sign',
      'eth_signTypedData',
      'eth_signTypedData_v4',
    ],
    events: ['chainChanged', 'accountsChanged'],
    rpcMap: {
      '1': 'https://eth-mainnet.g.alchemy.com/v2/V4IJ6qnD4Rb18k6jW_LJJfB9xSwiUbIC',
      '137': 'https://polygon-mainnet.g.alchemy.com/v2/hykYnKHGAJEKXerGbivc33lk-Zu36F_P',
      '1313161554': 'https://mainnet.aurora.dev',
    },
  },
};
