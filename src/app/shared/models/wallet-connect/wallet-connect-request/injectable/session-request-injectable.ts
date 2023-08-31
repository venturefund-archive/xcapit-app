import { Injectable } from '@angular/core';
import { SessionRequestFactory } from 'src/app/shared/models/wallet-connect/wallet-connect-request/factory/session-request-factory';
import { WalletConnectRequest } from '../wallet-connect-request.interface';
import { SignClientInjectable } from '../../sign-client/injectable/sign-client.injectable';
import { Wallet } from '../../../../../modules/wallets/shared-wallets/models/wallet/wallet';
import { SessionRequest } from '../../session-request/session-request';

@Injectable({ providedIn: 'root' })
export class SessionRequestInjectable {
  sessionRequest: WalletConnectRequest;

  constructor(private signClientInjectable: SignClientInjectable) {}

  public async createRequest(request: SessionRequest, wallet: Wallet): Promise<void> {
    const signClient = await this.signClientInjectable.create();
    this.sessionRequest = await new SessionRequestFactory(signClient).create(request, wallet);
  }

  public request(): WalletConnectRequest {
    return this.sessionRequest;
  }
}
