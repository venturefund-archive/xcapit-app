import { IonicStorageService } from '../../../../../shared/services/ionic-storage/ionic-storage.service';
import * as CryptoJs from 'crypto-js';
import { Password } from 'src/app/modules/swaps/shared-swaps/models/password/password';

export class LoginToken {
  constructor(
    private _aPassword: Password,
    private _storage: IonicStorageService,
    private _storageKey: string = 'loginToken'
  ) {}

  public async valid(): Promise<boolean> {
    console.log('login-token entered valid()')
    return (await this._storedHash()) === this._hash();
  }

  public save(): Promise<void> {
    return this._storage.set(this._storageKey, this._hash());
  }

  public async exist(): Promise<boolean> {
    return !!await this._storedHash();
  }

  private _hash(): string {
    return CryptoJs.SHA3(this._aPassword.value(), { outputLength: 512 }).toString(CryptoJs.enc.Base64);
  }

  private _storedHash(): Promise<string> {
    return this._storage.get(this._storageKey);
  }
}
