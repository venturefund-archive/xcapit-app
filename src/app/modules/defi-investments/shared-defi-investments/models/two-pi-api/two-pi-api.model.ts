import { TwoPi, Vault } from '@2pi-network/sdk';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TwoPiApi {
  instance: TwoPi;
  env = environment.environment;
  constructor() {
    this.instance = new TwoPi({});
  }

  getParams(): { networks: string[]; partner?: string } {
    return this.env === 'PRODUCCION' ? { networks: ['polygon'], partner: 'xcapit' } : { networks: ['mumbai'] };
  }

  async vaults(): Promise<Vault[]> {
    return await this.instance.getVaults(this.getParams());
  }

  vault(vaultID: string): Promise<Vault> {
    return this.vaults().then((vaults) => {
      return Promise.resolve(vaults.find((vault) => vault.identifier === vaultID));
    });
  }
}
