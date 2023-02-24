import { SignClientTypes } from '@walletconnect/types';
import { Wallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { SignClientV2 } from 'src/app/shared/models/wallet-connect/sign-client/sign-client';
import { Session } from '../../../../../../shared/models/wallet-connect/wc-session/wc-session';
import { Namespaces, ValidatedNamespaces } from '../namespaces/namespaces';

export type Proposal = SignClientTypes.EventArguments['session_proposal'];

export class PendingProposal {
  constructor(private _rawProposal: Proposal, private _aWallet: Wallet, private _signClient: SignClientV2) {}

  public peerMetadata(): SignClientTypes.Metadata {
    return this._rawProposal?.params?.proposer?.metadata;
  }

  public wallet(): Wallet {
    return this._aWallet;
  }

  public async approve(): Promise<Session> {
    const approvalPromise = this._signClient.approve({
      id: this._id(),
      relayProtocol: this._protocol(),
      namespaces: this._namespaces(),
    });
    const { acknowledged } = await approvalPromise;
    const session = await acknowledged();
    return session;
  }

  private _id(): number {
    return this._rawProposal.id;
  }
  private _protocol(): string {
    return this._rawProposal.params.relays[0].protocol;
  }

  private _namespaces(): ValidatedNamespaces {
    return new Namespaces(this._rawProposal.params.requiredNamespaces, this._aWallet).validate();
  }
}

// public checkDappStatus() {
//   return new Promise((resolve, reject) => {
//     let retry = 0;
//     const interval = setInterval(async () => {
//       console.log('checkDappStatus', this._pendingProposal);
//       if (this._pendingProposal) {
//         clearInterval(interval);
//         return resolve(true);
//       }

//       retry++;

//       if (retry >= 15) {
//         clearInterval(interval);
//         const error = 'Dapp not responding. Try scanning a new QR code'; //TODO: Replace with ping maybe?
//         // if (this.walletConnector && this.walletConnector.session) await this.killSession();

//         return reject(error);
//       }
//     }, 1000);
//   });
// }
