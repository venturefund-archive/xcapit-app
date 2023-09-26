import { SignClientTypes } from '@walletconnect/types';
import { Wallet } from 'src/app/modules/wallets/shared-wallets/models/wallet/wallet';
import { PendingProposal } from 'src/app/modules/wallets/shared-wallets/models/wallet-connect/pending-proposal/pending-proposal';
import { SignClientV2 } from '../sign-client/sign-client';
import { WCUri } from '../wc-uri/wc-uri.interface';
import { DefaultWallets } from 'src/app/modules/wallets/shared-wallets/models/wallets/default-wallets';
import { Blockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains.interface';
import { Wallets } from 'src/app/modules/wallets/shared-wallets/models/wallets/wallets.interface';

export class PairTo {
  constructor(
    private readonly _aUri: WCUri,
    private readonly _aSelectedWallet: Wallet,
    private readonly _signClient: SignClientV2,
    private readonly _blockchains: Blockchains,
    private readonly _wallets: Wallets
  ) {}

  public value(): Promise<PendingProposal> {
    return new Promise(async (resolve, reject) => {
      try {
        this._signClient.on('session_proposal', (proposal: SignClientTypes.EventArguments['session_proposal']) => {
          resolve(new PendingProposal(proposal, this._aSelectedWallet, this._signClient, this._blockchains, this._wallets));
        });
        await this._signClient.pair({ uri: this._aUri.value() });
      } catch (error) {
        reject(error);
      }
    });
  }
}
