import { TwoPi, Vault } from '@2pi-network/sdk';
import { environment } from 'src/environments/environment';
export class TwoPiApi {
  instance: TwoPi;
  env = environment.environment;
  constructor() {
    this.instance = new TwoPi({});
  }

  getNetworks(): { networks: string[] } {
    console.log(this.env);
    return this.env === 'PRODUCCION' ? { networks: ['polygon'] } : { networks: ['mumbai'] };
  }

  async vaults(): Promise<Vault[]> {
    return await this.instance.getVaults(this.getNetworks());
  }

  vault(vaultID: string): Promise<Vault> {
    return this.vaults().then((vaults) => {
      return Promise.resolve(vaults.find((vault) => vault.identifier === vaultID));
    });
  }
}
