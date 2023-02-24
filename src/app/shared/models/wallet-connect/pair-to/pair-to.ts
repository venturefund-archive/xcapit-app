import { SignClientTypes } from '@walletconnect/types';
import { Wallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { PendingProposal } from 'src/app/modules/wallets/shared-wallets/models/wallet-connect/pending-proposal/pending-proposal';
import { WCUri } from 'src/app/shared/models/wallet-connect/wc-uri/WCUri';
import { SignClientV2 } from '../sign-client/sign-client';

export class PairTo {
  constructor(
    private readonly _aUri: WCUri,
    private readonly _aWallet: Wallet,
    private readonly _signClient: SignClientV2
  ) {}

  public value(): Promise<PendingProposal> {
    return new Promise(async (resolve, reject) => {
      try {
        this._signClient.on('session_proposal', (proposal: SignClientTypes.EventArguments['session_proposal']) => {
          resolve(new PendingProposal(proposal, this._aWallet, this._signClient));
        });
        await this._signClient.pair({ uri: this._aUri.value() });
      } catch (error) {
        reject(error);
      }
    });
  }
}
