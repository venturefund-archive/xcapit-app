import { TwoPi, Vault } from '@2pi-network/sdk';
export class TwoPiApi {
  instance: TwoPi;
  constructor() {
    this.instance = new TwoPi({});
  }

  async vaults(): Promise<Vault[]> {
    return await this.instance.getVaults();
  }

  vault(vaultID: string): Promise<Vault> {
    return this.vaults().then((vaults) => {
      return Promise.resolve(vaults.find((vault) => vault.identifier === vaultID));
    });
  }
}
