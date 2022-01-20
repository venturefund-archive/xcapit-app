import { Fake } from './fake.spec';

export class FakeEthersService implements Fake {
  private readonly transferResponse;
  private readonly decryptedWallet;
  private readonly encryptedWallet;
  private spy;

  constructor(transferResponse = null, decryptedWallet = null, encryptedWallet = null) {
    this.transferResponse = transferResponse;
    this.decryptedWallet = decryptedWallet;
    this.encryptedWallet = encryptedWallet;
  }

  createSpy(): any {
    this.spy = jasmine.createSpyObj('EthersService', ['ethers', 'newContract', 'decryptWalletJsonSync', 'encryptWallet']);
    this.modifyReturns(this.transferResponse, this.decryptedWallet, this.encryptedWallet);
    return this.spy;
  }

  modifyReturns(transferResponse, decryptedWallet, encryptedWallet): void {
    this.spy.newContract.and.returnValue({
      populateTransaction: {
        transfer: () => Promise.resolve(transferResponse),
      },
      transfer: () => Promise.resolve(transferResponse),
    });

    this.spy.decryptWalletJsonSync.and.returnValue(decryptedWallet);
    this.spy.encryptWallet.and.returnValue(Promise.resolve(encryptedWallet));
  }

  throwError(message: string) {
    this.spy.decryptWalletJsonSync.and.throwError(new Error(message));
  }
}
