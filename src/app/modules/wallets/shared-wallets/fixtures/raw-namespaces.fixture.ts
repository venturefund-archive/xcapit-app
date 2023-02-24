import { RawNamespace } from '../models/wallet-connect/namespace/namespace';
import { RawNamespaces } from '../models/wallet-connect/namespaces/namespaces';
export const rawRequiredNamespacesWithTwoNamespaces: RawNamespaces = {
  eip155: {
    methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
    chains: ['eip155:5'],
    events: ['chainChanged', 'accountsChanged'],
  },
  bip122: {
    methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
    chains: ['bip122:000000000019d6689c085ae165831e93'],
    events: ['chainChanged', 'accountsChanged'],
  },
};

export const rawRequiredNamespacesWithUnsupportedNamespace: RawNamespaces = {
  bip122: {
    methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
    chains: ['bip122:000000000019d6689c085ae165831e93'],
    events: ['chainChanged', 'accountsChanged'],
  },
};

export const rawNamespaceWithTwoChains: RawNamespace = {
  methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
  chains: ['eip155:5', 'eip155:80001'],
  events: ['chainChanged', 'accountsChanged'],
};

export const rawNamespaceWithNotMatchingNetwork: RawNamespace = {
  methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
  chains: ['eip155:80001'],
  events: ['chainChanged', 'accountsChanged'],
};

export const rawValidRequiredNamespaces: RawNamespaces = {
  eip155: {
    methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
    chains: ['eip155:1'],
    events: ['chainChanged', 'accountsChanged'],
  },
};
