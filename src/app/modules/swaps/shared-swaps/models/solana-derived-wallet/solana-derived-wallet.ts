import * as bip39 from 'bip39';
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import { IBlockchain } from "../blockchain/blockchain";


export class SolanaDerivedWallet {

  private _cachedKeypair: Keypair;

  constructor(
    private _seedPhrase: string,
    private _aBlockchain: IBlockchain
  ) {}

  address(): string {
    return this._keypair().publicKey.toString();
  }

  value(): Keypair {
    return this._keypair();
  }

  private _keypair(): Keypair {
    if (!this._cachedKeypair) {
      this._cachedKeypair = Keypair.fromSeed(
        derivePath(
          this._aBlockchain.derivedPath(),
          bip39.mnemonicToSeedSync(this._seedPhrase, '').toString('hex')).key
      );
    }
    return this._cachedKeypair;
  }
}
