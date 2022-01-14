import { TwoPi, Vault } from '@2pi-network/sdk';
export class TwoPiApi {
  instance: TwoPi;
  constructor() {
    this.instance = new TwoPi({});
  }

  async vaults(): Promise<Vault[]> {
    return await this.instance.getVaults();
  }

  vault(vaultID: string): Vault {
    return this.vaults().then((vaults) => {
      console.log(vaults);
      return vaults.find((vault) => vault.identifier === vaultID);
    });
  }
}
