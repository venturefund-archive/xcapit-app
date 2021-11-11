import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';
import { Fake } from './fake.spec';

export class FakeWalletService implements Fake {
  private readonly walletExistResponse: any;
  private readonly balanceOfResponse: any;
  private readonly addresses: string;
  private spy: jasmine.SpyObj<WalletService>;

  constructor(walletExistResponse = null, balanceOfResponse = null, addresses = null) {
    this.walletExistResponse = walletExistResponse;
    this.balanceOfResponse = balanceOfResponse;
    this.addresses = addresses;
  }

  createSpy() {
    this.spy = jasmine.createSpyObj('WalletService', ['walletExist', 'balanceOf'], ['addresses']);
    this.modifyReturns(this.walletExistResponse, this.balanceOfResponse);
    this.modifyAttributes(this.addresses);
    return this.spy;
  }

  modifyReturns(walletExistResponse, balanceOfResponse) {
    this.spy.walletExist.and.returnValue(Promise.resolve(walletExistResponse));
    this.spy.balanceOf.and.returnValue(Promise.resolve(balanceOfResponse));
  }
  modifyAttributes(addresses) {
    (Object.getOwnPropertyDescriptor(this.spy, 'addresses').get as jasmine.Spy).and.returnValue(addresses);
  }
}
