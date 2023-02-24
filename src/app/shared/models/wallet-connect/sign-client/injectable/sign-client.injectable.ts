import { Injectable } from '@angular/core';
import { EnvService } from 'src/app/shared/services/env/env.service';
import { SignClientV2 } from '../sign-client';
import { SignClient } from '@walletconnect/sign-client';
import { SignClientTypes } from '@walletconnect/types';

// TODO: Fix types

@Injectable({ providedIn: 'root' })
export class SignClientInjectable {
  _signClient: SignClientV2;
  constructor(private envService: EnvService) {}

  async signClient(): Promise<SignClientV2> {
    if (!this._signClient) await this.createSignClient();
    return this._signClient;
  }

  private async createSignClient(): Promise<any> {
    this._signClient = await SignClientV2.create(this.envService);
    return this._signClient;
  }
}
