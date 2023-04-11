import { Proposal } from '../models/wallet-connect/pending-proposal/pending-proposal';
import { rawValidRequiredNamespaces } from './raw-namespaces.fixture';

export const rawPeerMetadata = {
  description: 'React App for WalletConnect',
  url: 'https://react-app.walletconnect.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  name: 'React App',
};

export const rawProposal: Proposal = {
  id: 1677598962631865,
  params: {
    id: 1677598962631865,
    pairingTopic: '905189e9ee5faee1e08b157d0c86c5ee55c4c5e5f43418b48f8c7c66900eb2c8',
    expiry: 1677599266,
    requiredNamespaces: rawValidRequiredNamespaces,
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
};
