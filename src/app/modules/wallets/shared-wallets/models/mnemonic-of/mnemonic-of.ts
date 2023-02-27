import { Wallet as EthersWallet } from 'ethers';
import { Password } from 'src/app/modules/swaps/shared-swaps/models/password/password';


export class MnemonicOf {
  constructor(
    private _aPassword: Password,
    private _aEncryptedWallet: string,
    private _ethersWallet: any = EthersWallet) {}

  async phrase(): Promise<string> {
    return (
      await this._ethersWallet
        .fromEncryptedJson(
          this._aEncryptedWallet,
          this._aPassword.value()
        )
    ).mnemonic.phrase;
  }
}
