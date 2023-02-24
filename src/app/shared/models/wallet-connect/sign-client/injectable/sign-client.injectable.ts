import { Injectable } from '@angular/core';
import { EnvService } from 'src/app/shared/services/env/env.service';
import { SignClientV2 } from '../sign-client';

@Injectable({ providedIn: 'root' })
export class SignClientInjectable {
  _signClient: SignClientV2;
  constructor(private envService: EnvService) {}

  async signClient(): Promise<SignClientV2> {
    if (!this._signClient) await this.createSignClient();
    return this._signClient;
  }

  private async createSignClient(): Promise<SignClientV2> {
    this._signClient = await SignClientV2.create(this.envService);
    return this._signClient;
  }
}
