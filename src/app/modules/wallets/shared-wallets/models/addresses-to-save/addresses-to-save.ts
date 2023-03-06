export class AddressesToSave {
  constructor(private _encryptedWallet: any) {}

  public toJson(): any {
    return Object.keys(this._encryptedWallet.addresses).map((network) => ({
      network,
      address: this._encryptedWallet.addresses[network],
    }));
  }
}
