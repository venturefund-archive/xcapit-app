export class FakeEthersWallet {

  mnemonic: any = { phrase: '' };

  fromEncryptedJson() {
    return Promise.resolve(this);
  }

  fromMnemonic() {
    return this;
  }

  connect() {
    return this;
  }

  sendTransaction() {
    return Promise.resolve({ wait: () => Promise.resolve(true) });
  }
}
