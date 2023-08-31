import { SessionTypes, SignClientTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { Wallet } from 'src/app/modules/wallets/shared-wallets/models/wallet/wallet';
import { SignClientV2 } from 'src/app/shared/models/wallet-connect/sign-client/sign-client';

export type RawSession = SessionTypes.Struct;

export class WCSession {
  constructor(
    private readonly _rawSession: RawSession,
    private readonly _signClient: SignClientV2,
    private readonly _aWallet: Wallet
  ) {}

  public disconnect() {
    this._signClient.disconnect({
      topic: this._rawSession.topic,
      reason: getSdkError('USER_DISCONNECTED'),
    });
  }

  public peerMetadata(): SignClientTypes.Metadata {
    return this._rawSession.peer.metadata;
  }

  public wallet(): Wallet {
    return this._aWallet;
  }
}
