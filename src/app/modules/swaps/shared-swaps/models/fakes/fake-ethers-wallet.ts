import { addressByDerivedPath } from '../fixtures/raw-address-by-derivedpath-data';
import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';

export class FakeEthersWallet {
  private _addresses = addressByDerivedPath;
  private _address: string;

  constructor(private _mnemonicReturned: any = { phrase: '' }) {}

  get mnemonic() {
    return this._mnemonicReturned;
  }

  get address() {
    return this._address;
  }

  fromEncryptedJson() {
    return Promise.resolve(this);
  }

  fromMnemonic(aPhrase: string = '', aDerivedPath: string = '', aWordlist: any = null) {
    this._address = this._addresses.get(aDerivedPath);
    return this;
  }

  connect() {
    return this;
  }

  encrypt() {
    return Promise.resolve('');
  }

  sendTransaction() {
    return Promise.resolve({ hash: 'aTestHash', wait: () => Promise.resolve(true) });
  }

  signMessage() {
    return Promise.resolve('signed message');
  }

  _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ): any {
    return undefined;
  }

  signTransaction(): Promise<string> {
    return Promise.resolve('a signed tx');
  }
}
