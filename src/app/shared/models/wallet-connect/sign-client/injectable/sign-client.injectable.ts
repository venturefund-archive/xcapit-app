import { Injectable } from '@angular/core';
import { EnvService } from 'src/app/shared/services/env/env.service';
import { SignClientV2 } from '../sign-client';

@Injectable({ providedIn: 'root' })
export class SignClientInjectable {
  _signClient: SignClientV2;
  constructor(private envService: EnvService) {}

  async create(signClientClass: typeof SignClientV2 = SignClientV2): Promise<SignClientV2> {
    if (!this._signClient) await this.createSignClient(signClientClass);
    return this._signClient;
  }

  private async createSignClient(signClientClass: typeof SignClientV2): Promise<void> {
    this._signClient = await signClientClass.create(this.envService);
  }
}
