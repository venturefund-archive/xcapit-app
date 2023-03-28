import { Injectable } from '@angular/core';
import { SessionRequestFactory } from 'src/app/shared/models/wallet-connect/session-request/factory/session-request-factory';
import { RawSessionRequest } from 'src/app/shared/models/wallet-connect/session-request/raw-session-request.type';
import { SessionRequest } from '../session-request.interface';
import { SignClientInjectable } from '../../sign-client/injectable/sign-client.injectable';
import { Wallet } from '../../../../../modules/swaps/shared-swaps/models/wallet/wallet';
import { SignRequest } from '../sign-request/sign-request';

@Injectable({ providedIn: 'root' })
export class SessionRequestInjectable {
  sessionRequest: SessionRequest;

  constructor(private signClientInjectable: SignClientInjectable) {}

  public async createRequest(request: RawSessionRequest, wallet: Wallet): Promise<void> {
    const signClient = await this.signClientInjectable.create();
    this.sessionRequest = await new SessionRequestFactory(signClient).createRequest(request, wallet);
  }

  public request(): SessionRequest | SignRequest {
    return this.sessionRequest;
  }
}
